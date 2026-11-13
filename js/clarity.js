/* ============================================================
   js/clarity.js — "Clarity", the Claritas site assistant
   ------------------------------------------------------------
   No LLM, no server, no API costs. Every reply is a prepared
   answer from js/clarity-kb.js. Clarity just works out which one
   you're asking for:

   1. Entities: spots subjects ("ext 2", "chem") and tutor names
      so answers like "who teaches X" are built from real data.
   2. Keyword matcher (instant): TF-IDF over the example
      questions, with synonyms. Works offline and as a fallback.
   3. Semantic matcher (loads in the background when the chat is
      first opened): a small sentence-embedding model
      (all-MiniLM-L6-v2, ~23 MB, cached by the browser) runs in
      the visitor's browser via Transformers.js and compares the
      meaning of the question with every example question.

   Unanswered questions are sent to Google Analytics as the
   `clarity_unanswered` event so you can add them to the KB.
   ============================================================ */

'use strict';

(function (root) {

    const CONFIG = {
        transformersUrl: 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.3.2',
        model: 'Xenova/all-MiniLM-L6-v2',
        // Semantic (embedding) thresholds
        semAccept: 0.62,
        semAcceptWithGap: 0.55,   // also accept from here if clearly ahead of the runner-up
        semGap: 0.1,
        semMaybe: 0.48,
        // Keyword-only thresholds (used before the model is ready)
        lexAccept: 0.42,
        lexMaybe: 0.26,
        waitForModelMs: 2500
    };

    /* ============================================================
       ENGINE (pure logic, also runs in Node for tests)
       ============================================================ */
    function createEngine(KB) {

        const STOP = new Set(('a an the is are am was were be been do does did i im me my mine you your youre we our us to of for in on at it its ' +
            'this that these those can could would should will with and or so just please about have has had any there their they them ' +
            'if then than also really very like some get got want wanna need know tell let lets ok okay oh um u ur r y').split(' '));

        const synMap = {};
        Object.keys(KB.SYNONYMS).forEach(canon => KB.SYNONYMS[canon].forEach(w => { synMap[w] = canon; }));

        function normalize(text) {
            return (' ' + String(text).toLowerCase()
                .replace(/[’‘`]/g, "'")
                .replace(/'s\b/g, '')
                .replace(/'/g, '')
                .replace(/\$/g, ' $ ')
                .replace(/[^a-z0-9$]+/g, ' ')
                .replace(/\s+/g, ' ')
                .trim() + ' ');
        }

        /* ---------- Entity lexicon (longest alias wins) ---------- */
        const lexicon = [];
        KB.UNSUPPORTED.forEach(a => lexicon.push({ alias: normalize(a).trim(), type: 'unsupported', value: a }));
        Object.keys(KB.SUBJECTS).forEach(id => KB.SUBJECTS[id].aliases.forEach(a => lexicon.push({ alias: normalize(a).trim(), type: 'subject', value: id })));
        Object.keys(KB.SUBJECT_GROUPS).forEach(id => KB.SUBJECT_GROUPS[id].aliases.forEach(a => lexicon.push({ alias: normalize(a).trim(), type: 'group', value: id })));
        KB.TUTORS.forEach(t => t.aliases.forEach(a => lexicon.push({ alias: normalize(a).trim(), type: 'tutor', value: t.id })));
        lexicon.sort((x, y) => y.alias.length - x.alias.length);

        function extractEntities(text) {
            let s = normalize(text);
            const e = { subjects: [], tutors: [], unsupported: [], year: null };
            const pos = {};
            let at = 0;
            const push = (arr, v) => { if (!arr.includes(v)) { arr.push(v); pos[v] = at; } };
            for (const item of lexicon) {
                const needle = ' ' + item.alias + ' ';
                at = s.indexOf(needle);
                if (at === -1) continue;
                s = s.split(needle).join(' ' + '_'.repeat(item.alias.length) + ' ');
                if (item.type === 'unsupported') push(e.unsupported, item.value);
                else if (item.type === 'subject') push(e.subjects, item.value);
                else if (item.type === 'group') KB.SUBJECT_GROUPS[item.value].members.forEach(m => push(e.subjects, m));
                else if (item.type === 'tutor') push(e.tutors, item.value);
            }
            [e.subjects, e.tutors, e.unsupported].forEach(arr => arr.sort((a, b) => pos[a] - pos[b]));
            const y = normalize(text).match(/ (?:year|yr|grade|y) ?(\d{1,2}) /);
            if (y) e.year = parseInt(y[1], 10);
            return e;
        }

        /* Replace entities with placeholder tokens so "who teaches chem"
           and "who teaches physics" look the same to the keyword matcher. */
        function placeholderize(text) {
            let s = normalize(text);
            for (const item of lexicon) {
                const needle = ' ' + item.alias + ' ';
                if (s.indexOf(needle) === -1) continue;
                const tok = item.type === 'tutor' ? ' zztutor ' : ' zzsubject ';
                s = s.split(needle).join(tok);
            }
            return s;
        }

        function stem(w) {
            if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
            if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
            if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
            return w;
        }

        function tokens(text) {
            return placeholderize(text).trim().split(' ')
                .filter(w => w && !STOP.has(w))
                .map(w => synMap[w] || stem(w));
        }

        /* ---------- TF-IDF over example questions ---------- */
        const docs = [];   // { intent, text, vec }
        KB.INTENTS.forEach(intent => intent.examples.forEach(ex => docs.push({ intent: intent.id, text: ex })));
        const df = {};
        const docTokens = docs.map(d => tokens(d.text));
        docTokens.forEach(toks => new Set(toks).forEach(t => { df[t] = (df[t] || 0) + 1; }));
        const N = docs.length;
        const idf = t => Math.log((N + 1) / ((df[t] || 0) + 1)) + 1;

        function tfidf(toks) {
            const v = {};
            toks.forEach(t => { v[t] = (v[t] || 0) + 1; });
            let norm = 0;
            Object.keys(v).forEach(t => { v[t] = v[t] * idf(t); norm += v[t] * v[t]; });
            norm = Math.sqrt(norm) || 1;
            Object.keys(v).forEach(t => { v[t] /= norm; });
            return v;
        }
        docs.forEach((d, i) => { d.vec = tfidf(docTokens[i]); });

        function lexicalScores(text) {
            const q = tfidf(tokens(text));
            const scores = {};
            docs.forEach(d => {
                let s = 0;
                for (const t in q) if (d.vec[t]) s += q[t] * d.vec[t];
                if (!(d.intent in scores) || s > scores[d.intent]) scores[d.intent] = s;
            });
            return scores;
        }

        /* ---------- Semantic scores (vectors supplied by the UI layer) ---------- */
        let exampleVecs = null;  // Float32Array[] aligned with docs
        function setExampleVectors(vecs) { exampleVecs = vecs; }
        function semanticScores(qvec) {
            const scores = {};
            docs.forEach((d, i) => {
                const v = exampleVecs[i];
                let s = 0;
                for (let k = 0; k < v.length; k++) s += v[k] * qvec[k];
                if (!(d.intent in scores) || s > scores[d.intent]) scores[d.intent] = s;
            });
            return scores;
        }

        /* ---------- Routing ---------- */
        const SUBJECTISH = new Set(['subject_tutors', 'subjects_list', 'tutors_overview', 'unsupported_subject', 'how_to_book', 'year_levels', 'about']);
        const TUTORISH = new Set(['tutors_overview', 'tutor_profile', 'subject_tutors', 'subjects_list', 'results', 'atar', 'about']);

        function route(text, qvec) {
            const ents = extractEntities(text);
            const lex = lexicalScores(text);
            const useSem = !!(qvec && exampleVecs);
            const sem = useSem ? semanticScores(qvec) : null;
            const accept = useSem ? CONFIG.semAccept : CONFIG.lexAccept;
            const maybe = useSem ? CONFIG.semMaybe : CONFIG.lexMaybe;

            const combined = {};
            Object.keys(lex).forEach(id => {
                combined[id] = useSem ? sem[id] + 0.12 * lex[id] : lex[id];
            });
            const ranked = Object.keys(combined).sort((a, b) => combined[b] - combined[a]);
            let best = ranked[0];
            let score = combined[best];
            let method = useSem ? 'semantic' : 'keyword';
            const gap = score - (combined[ranked[1]] || 0);
            const confident = score >= accept ||
                (useSem && score >= CONFIG.semAcceptWithGap && gap >= CONFIG.semGap);

            // Entity-driven overrides
            if (ents.unsupported.length && !ents.subjects.length && (!confident || SUBJECTISH.has(best))) {
                best = 'unsupported_subject'; method = 'entity';
            } else if (ents.subjects.length && !ents.tutors.length && (!confident || SUBJECTISH.has(best) || best === 'tutor_profile')) {
                if (best !== 'how_to_book' || !confident) best = 'subject_tutors';
                method = 'entity';
            } else if (ents.tutors.length && (!confident || TUTORISH.has(best))) {
                best = 'tutor_profile'; method = 'entity';
            } else if (ents.year && ents.year < 10 && !confident) {
                best = 'year_levels'; method = 'entity';
            }

            const resolved = method === 'entity' || confident;
            const unsure = !resolved && score >= maybe;
            return {
                intent: resolved ? best : null,
                options: unsure ? ranked.slice(0, 3) : [],
                score, method, entities: ents,
                top: ranked.slice(0, 5).map(id => [id, +combined[id].toFixed(3)])
            };
        }

        function render(intentId, ents) {
            const intent = KB.intent(intentId);
            const e = {
                subjects: ents.subjects || [],
                tutors: (ents.tutors || []).map(id => KB.tutorById(id)),
                unsupported: ents.unsupported || [],
                year: ents.year || null
            };
            const html = typeof intent.answer === 'function' ? intent.answer(e, KB) : intent.answer;
            return { html, chips: intent.chips || [] };
        }

        return { route, render, extractEntities, setExampleVectors, docs, normalize };
    }

    root.ClarityEngine = { createEngine, CONFIG };
    if (typeof module !== 'undefined' && module.exports) module.exports = { createEngine, CONFIG };

    /* ============================================================
       UI (browser only)
       ============================================================ */
    if (typeof document === 'undefined' || !root.CLARITY_KB) return;

    const KB = root.CLARITY_KB;
    const engine = createEngine(KB);
    const STORE_KEY = 'clarity-session-v1';
    const NUDGE_KEY = 'clarity-nudged';

    /* ---------- Semantic model loader ---------- */
    let sem = { state: 'idle', extractor: null, promise: null };

    function hash(str) {
        let h = 5381;
        for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
        return (h >>> 0).toString(36);
    }
    function f32ToB64(arr) {
        const bytes = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
        let bin = '';
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
        return btoa(bin);
    }
    function b64ToF32(b64) {
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new Float32Array(bytes.buffer);
    }

    function loadSemantic() {
        if (sem.promise) return sem.promise;
        const conn = navigator.connection;
        if (conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || ''))) {
            sem.state = 'skipped';
            return (sem.promise = Promise.resolve(false));
        }
        sem.state = 'loading';
        sem.promise = (async () => {
            const { pipeline, env } = await import(CONFIG.transformersUrl);
            env.allowLocalModels = false;
            const extractor = await pipeline('feature-extraction', CONFIG.model, { dtype: 'q8' });

            const texts = engine.docs.map(d => d.text);
            const key = 'clarity-emb-' + hash(CONFIG.model + '|' + texts.join('|'));
            let flat = null;
            try {
                const cached = localStorage.getItem(key);
                if (cached) flat = b64ToF32(cached);
            } catch (_) { /* storage unavailable */ }

            let dim;
            if (!flat || flat.length % texts.length !== 0) {
                const parts = [];
                for (let i = 0; i < texts.length; i += 32) {
                    const out = await extractor(texts.slice(i, i + 32), { pooling: 'mean', normalize: true });
                    parts.push(out.data);
                    dim = out.dims[1];
                }
                flat = new Float32Array(parts.reduce((n, p) => n + p.length, 0));
                let off = 0;
                parts.forEach(p => { flat.set(p, off); off += p.length; });
                try {
                    Object.keys(localStorage).filter(k => k.startsWith('clarity-emb-') && k !== key).forEach(k => localStorage.removeItem(k));
                    localStorage.setItem(key, f32ToB64(flat));
                } catch (_) { /* quota or privacy mode: fine, recompute next time */ }
            }
            dim = flat.length / texts.length;
            const vecs = [];
            for (let i = 0; i < texts.length; i++) vecs.push(flat.subarray(i * dim, (i + 1) * dim));
            engine.setExampleVectors(vecs);
            sem.extractor = extractor;
            sem.state = 'ready';
            return true;
        })().catch(err => {
            sem.state = 'failed';
            if (root.console) console.warn('[Clarity] semantic model unavailable, using keyword matching.', err);
            return false;
        });
        return sem.promise;
    }

    async function embedQuery(text) {
        if (sem.state === 'loading') {
            await Promise.race([sem.promise, new Promise(r => setTimeout(r, CONFIG.waitForModelMs))]);
        }
        if (sem.state !== 'ready') return null;
        try {
            const out = await sem.extractor(text, { pooling: 'mean', normalize: true });
            return out.data;
        } catch (_) { return null; }
    }

    /* ---------- Analytics ---------- */
    function track(name, params) {
        try { if (typeof root.gtag === 'function') root.gtag('event', name, params); } catch (_) { }
    }
    function redact(q) {
        return q.replace(/\S+@\S+/g, '[email]').replace(/\+?\d[\d\s-]{6,}\d/g, '[number]').slice(0, 100);
    }

    /* ---------- DOM ---------- */
    const imgBase = (document.querySelector('link[href*="css/main.css"]') || {}).getAttribute
        ? document.querySelector('link[href*="css/main.css"]').getAttribute('href').replace(/css\/main\.css.*$/, '')
        : '';

    const wrap = document.createElement('div');
    wrap.className = 'clarity';
    wrap.innerHTML = `
        <button class="clarity-launcher" type="button" aria-label="Ask Clarity, the Claritas assistant" aria-expanded="false" aria-controls="clarity-panel">
            <svg class="clarity-icon-chat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z" fill="currentColor"/><circle cx="8.5" cy="9.5" r="1.2" fill="#1a1a2e"/><circle cx="12" cy="9.5" r="1.2" fill="#1a1a2e"/><circle cx="15.5" cy="9.5" r="1.2" fill="#1a1a2e"/></svg>
            <svg class="clarity-icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
            <span class="clarity-launcher-text">Ask Clarity</span>
        </button>
        <div class="clarity-nudge" role="status" hidden>Questions about tutors, pricing or the HSC? <b>Ask me.</b><button type="button" class="clarity-nudge-x" aria-label="Dismiss">×</button></div>
        <div class="clarity-panel" id="clarity-panel" role="dialog" aria-label="Clarity assistant" hidden>
            <div class="clarity-head">
                <img class="clarity-avatar" src="${imgBase}images/favicon.png" alt="" width="38" height="38">
                <div class="clarity-title">
                    <span class="clarity-name">Clarity</span>
                    <span class="clarity-sub">Claritas assistant · instant answers</span>
                </div>
                <button class="clarity-reset" type="button" aria-label="Start a new chat" title="New chat">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="clarity-close" type="button" aria-label="Close chat">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                </button>
            </div>
            <div class="clarity-log" role="log" aria-live="polite"></div>
            <form class="clarity-form" autocomplete="off">
                <label class="clarity-sr" for="clarity-input">Type your question</label>
                <input id="clarity-input" class="clarity-input" type="text" maxlength="300" placeholder="Ask about tutors, pricing, scaling..." enterkeyhint="send">
                <button class="clarity-send" type="submit" aria-label="Send">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z" fill="currentColor"/></svg>
                </button>
            </form>
            <p class="clarity-foot">Answers written by the Claritas team · <a href="mailto:${KB.EMAIL}">Email a human</a></p>
        </div>`;

    const $ = sel => wrap.querySelector(sel);
    const launcher = $('.clarity-launcher');
    const panel = $('.clarity-panel');
    const log = $('.clarity-log');
    const form = $('.clarity-form');
    const input = $('.clarity-input');
    const nudge = $('.clarity-nudge');

    let state = { open: false, msgs: [] };
    let busy = false;

    function save() {
        try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ open: state.open, msgs: state.msgs.slice(-40) })); } catch (_) { }
    }
    function restore() {
        try {
            const s = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
            if (s && Array.isArray(s.msgs)) state = s;
        } catch (_) { }
    }

    function scrollDown() { log.scrollTop = log.scrollHeight; }

    function clearChips() { log.querySelectorAll('.clarity-chips').forEach(c => c.remove()); }

    function addChips(chips, kind) {
        if (!chips || !chips.length) return;
        const row = document.createElement('div');
        row.className = 'clarity-chips';
        if (kind === 'options') row.setAttribute('data-kind', 'options');
        chips.forEach(([label, intentId]) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'clarity-chip';
            b.textContent = label;
            b.addEventListener('click', () => ask(label, intentId));
            row.appendChild(b);
        });
        log.appendChild(row);
        scrollDown();
    }

    function addMsg(role, html, chips, persist = true) {
        const el = document.createElement('div');
        el.className = 'clarity-msg clarity-' + (role === 'u' ? 'user' : 'bot');
        if (role === 'u') el.textContent = html; else el.innerHTML = html;
        log.appendChild(el);
        if (role === 'b') {
            el.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', () =>
                track('clarity_link_click', { link_url: a.getAttribute('href') })));
        }
        if (persist) { state.msgs.push({ r: role, h: html, c: chips || null }); save(); }
        scrollDown();
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'clarity-msg clarity-bot clarity-typing';
        t.setAttribute('aria-label', 'Clarity is typing');
        t.innerHTML = '<span></span><span></span><span></span>';
        log.appendChild(t);
        scrollDown();
        return t;
    }

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function ask(text, forcedIntent) {
        text = String(text || '').trim();
        if (!text || busy) return;
        busy = true;
        clearChips();
        addMsg('u', text);
        const typing = showTyping();
        const started = Date.now();

        let reply;
        try {
            if (forcedIntent) {
                const r = engine.render(forcedIntent, engine.extractEntities(text));
                reply = { html: r.html, chips: r.chips };
                track('clarity_question', { intent: forcedIntent, method: 'chip' });
            } else {
                const qvec = await embedQuery(text);
                const r = engine.route(text, qvec);
                if (r.intent) {
                    const out = engine.render(r.intent, r.entities);
                    reply = { html: out.html, chips: out.chips };
                    track('clarity_question', { intent: r.intent, method: r.method, score: Math.round(r.score * 100) / 100 });
                } else if (r.options.length) {
                    reply = {
                        html: `I'm not quite sure what you mean. Is it one of these?`,
                        chips: r.options.map(id => [KB.LABELS[id] || id, id]),
                        kind: 'options'
                    };
                    track('clarity_unsure', { query: redact(text), best_guess: r.options[0] });
                } else {
                    reply = { html: KB.FALLBACK.answer, chips: KB.FALLBACK.chips };
                    track('clarity_unanswered', { query: redact(text) });
                }
                if (root.CLARITY_DEBUG) console.log('[Clarity]', text, r);
            }
        } catch (err) {
            reply = { html: KB.FALLBACK.answer, chips: KB.FALLBACK.chips };
        }

        const wait = Math.max(0, 450 + Math.min(reply.html.length, 400) - (Date.now() - started));
        await sleep(wait);
        typing.remove();
        addMsg('b', reply.html, reply.chips);
        addChips(reply.chips, reply.kind);
        busy = false;
    }

    function renderAll() {
        log.innerHTML = '';
        if (!state.msgs.length) {
            addMsg('b', KB.WELCOME.answer, KB.WELCOME.chips);
            addChips(KB.WELCOME.chips);
            return;
        }
        state.msgs.forEach(m => addMsg(m.r, m.h, null, false));
        const last = state.msgs[state.msgs.length - 1];
        if (last && last.r === 'b' && last.c) addChips(last.c);
    }

    function setOpen(open, focus = true) {
        state.open = open;
        panel.hidden = !open;
        wrap.classList.toggle('is-open', open);
        launcher.setAttribute('aria-expanded', String(open));
        hideNudge();
        save();
        if (open) {
            if (!log.childElementCount) renderAll();
            scrollDown();
            if (focus && !matchMedia('(max-width: 768px)').matches) input.focus();
            const idle = root.requestIdleCallback || (cb => setTimeout(cb, 300));
            idle(() => loadSemantic());
        } else if (focus) {
            launcher.focus();
        }
        document.documentElement.classList.toggle('clarity-lock', open && matchMedia('(max-width: 768px)').matches);
    }

    function hideNudge() {
        nudge.hidden = true;
        try { sessionStorage.setItem(NUDGE_KEY, '1'); } catch (_) { }
    }

    launcher.addEventListener('click', () => {
        if (!state.open) track('clarity_open', { page: location.pathname });
        setOpen(!state.open);
    });
    $('.clarity-close').addEventListener('click', () => setOpen(false));
    $('.clarity-reset').addEventListener('click', () => {
        state.msgs = [];
        save();
        log.innerHTML = '';
        renderAll();
        input.focus();
    });
    $('.clarity-nudge-x').addEventListener('click', e => { e.stopPropagation(); hideNudge(); });
    nudge.addEventListener('click', () => setOpen(true));
    form.addEventListener('submit', e => {
        e.preventDefault();
        const q = input.value;
        input.value = '';
        ask(q);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && state.open) setOpen(false);
    });

    function mount() {
        document.body.appendChild(wrap);
        restore();
        if (state.open) setOpen(true, false);

        let nudged = false;
        try { nudged = sessionStorage.getItem(NUDGE_KEY) === '1'; } catch (_) { }
        if (!nudged && !state.open && !state.msgs.length && !matchMedia('(max-width: 768px)').matches) {
            setTimeout(() => { if (!state.open) nudge.hidden = false; }, 9000);
        }
    }

    root.Clarity = {
        open: () => setOpen(true),
        ask: q => { setOpen(true); ask(q); },
        debug: async q => engine.route(q, await embedQuery(q)),
        loadModel: loadSemantic,
        get modelState() { return sem.state; }
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
    else mount();

})(typeof window !== 'undefined' ? window : globalThis);
