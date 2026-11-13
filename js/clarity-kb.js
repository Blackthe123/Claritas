/* ============================================================
   js/clarity-kb.js — Knowledge base for "Clarity", the site assistant
   ------------------------------------------------------------
   HOW TO EDIT
   - Every intent has `examples` (ways people might ask) and an
     `answer` (what Clarity replies). Add more examples whenever you
     see a question Clarity missed: that is the whole "training".
   - Answers are HTML. Use absolute links ("/tutors.html") so they
     work from /blog/ pages too.
   - `chips` are follow-up buttons: [label, intentId].
   - Clarity re-embeds the examples automatically when they change.
   ============================================================ */

'use strict';

(function (root) {

    const EMAIL = 'info@claritasacademics.com';
    const PHONE = '+61 406 227 992';
    const PHONE_HREF = 'tel:+61406227992';
    const MAIL = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
    const TEL = `<a href="${PHONE_HREF}">${PHONE}</a>`;

    /* ---------------- Tutors ---------------- */
    const TUTORS = [
        {
            id: 'tutor1', name: 'Ayush Yajaman', first: 'Ayush', atar: '99.30',
            aliases: ['ayush', 'yajaman', 'founder', 'owner'],
            subjects: ['math_adv', 'ext1', 'ext2', 'physics', 'chemistry', 'seng'],
            cal: 'https://cal.com/ayush-yajaman-bf5qw6',
            bio: 'Founder of Claritas. 99.30 ATAR, the highest in his school\'s history, from a non-selective school after moving to Australia in Year 10. Now studying Advanced Computer Science (Honours) at UNSW and a published AI researcher.'
        },
        {
            id: 'tutor2', name: 'Ned Reside', first: 'Ned', atar: '97.00',
            aliases: ['ned', 'reside'],
            subjects: ['eng_std', 'eng_adv', 'legal', 'modern', 'ancient'],
            cal: 'https://cal.com/nedreside',
            bio: 'Band 6 in all six of his HSC subjects. Studies Politics, Philosophy and Economics at USYD and has been published in the academic journal Overland. Big on writing, structure and critical thinking.'
        },
        {
            id: 'tutor3', name: 'Tarun Vakkalagadda', first: 'Tarun', atar: '99.05',
            aliases: ['tarun', 'vakkalagadda'],
            subjects: ['ext1', 'ext2', 'chemistry'],
            cal: 'https://cal.com/tarun-vakkalagadda',
            bio: 'Band 6 in 4U Maths, Chemistry and Physics. Studies Actuarial Studies and Computer Science at UNSW. Breaks hard Maths and Chemistry into manageable chunks instead of rote learning.'
        },
        {
            id: 'tutor4', name: 'Aditya Shivakumar', first: 'Aditya', atar: '98.35',
            aliases: ['aditya', 'shivakumar', 'adi'],
            subjects: ['math_adv', 'math_std', 'biology', 'business'],
            cal: 'https://cal.com/aditya.s1501',
            bio: 'Band 6 in Maths, Biology and Business Studies. Studies Commerce and Information Systems at UNSW. Specialises in structured frameworks and study systems.'
        }
    ];

    /* ---------------- Subjects we teach ----------------
       `groups` lets "maths" or "science" expand to several courses. */
    const SUBJECTS = {
        math_std:  { name: 'Maths Standard',       aliases: ['maths standard', 'math standard', 'standard maths', 'standard math', 'general maths', 'maths std', 'math std'] },
        math_adv:  { name: 'Maths Advanced',       aliases: ['maths advanced', 'math advanced', 'advanced maths', 'advanced math', 'maths adv', 'math adv', '2u maths', '2u', '2 unit maths', '2 unit'] },
        ext1:      { name: 'Maths Extension 1',    aliases: ['maths extension 1', 'math extension 1', 'mathematics extension 1', 'extension 1 maths', 'extension one', 'extension 1', 'ext 1', 'ext1', 'x1', 'mx1', '3u maths', '3u', '3 unit maths', '3 unit'] },
        ext2:      { name: 'Maths Extension 2',    aliases: ['maths extension 2', 'math extension 2', 'mathematics extension 2', 'extension 2 maths', 'extension two', 'extension 2', 'ext 2', 'ext2', 'x2', 'mx2', '4u maths', '4u', '4 unit maths', '4 unit'] },
        physics:   { name: 'Physics',              aliases: ['physics', 'phys', 'phyiscs', 'physic'] },
        chemistry: { name: 'Chemistry',            aliases: ['chemistry', 'chem', 'chemisty'] },
        biology:   { name: 'Biology',              aliases: ['biology', 'bio'] },
        eng_std:   { name: 'English Standard',     aliases: ['english standard', 'standard english', 'english std'] },
        eng_adv:   { name: 'English Advanced',     aliases: ['english advanced', 'advanced english', 'english adv'] },
        legal:     { name: 'Legal Studies',        aliases: ['legal studies', 'legal', 'law'] },
        modern:    { name: 'Modern History',       aliases: ['modern history', 'modern hist', 'modern'] },
        ancient:   { name: 'Ancient History',      aliases: ['ancient history', 'ancient hist', 'ancient'] },
        business:  { name: 'Business Studies',     aliases: ['business studies', 'business', 'biz studies', 'busi'] },
        seng:      { name: 'Software Engineering', aliases: ['software engineering', 'software', 'seng', 'sen', 'coding', 'programming', 'computing', 'computer science'] }
    };

    const SUBJECT_GROUPS = {
        maths:   { name: 'Maths',      aliases: ['maths', 'math', 'mathematics', 'calculus'], members: ['math_std', 'math_adv', 'ext1', 'ext2'] },
        science: { name: 'Science',    aliases: ['science', 'sciences'], members: ['physics', 'chemistry', 'biology'] },
        english: { name: 'English',    aliases: ['english', 'essays', 'essay writing'], members: ['eng_std', 'eng_adv'] },
        history: { name: 'History',    aliases: ['history'], members: ['modern', 'ancient'] },
        humanities: { name: 'Humanities', aliases: ['humanities', 'hsie'], members: ['legal', 'modern', 'ancient', 'business'] }
    };

    /* Common HSC courses we do NOT currently list. Matched before the
       courses above, so "history extension" doesn't read as "history". */
    const UNSUPPORTED = [
        'english extension 1', 'english extension 2', 'english extension', 'english ext', 'eald', 'eal/d', 'english eal', 'english studies',
        'history extension', 'science extension', 'investigating science', 'earth and environmental science', 'earth and environmental', 'eesc',
        'engineering studies', 'enterprise computing', 'economics', 'eco', 'geography', 'geo', 'pdhpe', 'studies of religion', 'sor',
        'society and culture', 'visual arts', 'music', 'drama', 'dance', 'design and technology', 'food technology', 'cafs',
        'community and family studies', 'aboriginal studies', 'industrial technology', 'textiles', 'agriculture',
        'french', 'japanese', 'chinese', 'mandarin', 'spanish', 'german', 'italian', 'korean', 'hindi', 'latin', 'indonesian', 'arabic',
        'naplan', 'selective school test', 'selective test', 'oc test', 'ucat', 'hsie year 7'
    ];

    /* ---------------- Synonyms for the keyword matcher ----------------
       Collapses words people use interchangeably onto one token. */
    const SYNONYMS = {
        price: ['price', 'prices', 'pricing', 'cost', 'costs', 'costing', 'fee', 'fees', 'charge', 'charges', 'rate', 'rates', 'expensive', 'cheap', 'cheaper', 'afford', 'affordable', 'much', 'dollars', 'money', '$'],
        book: ['book', 'booking', 'bookings', 'enrol', 'enroll', 'enrolment', 'enrollment', 'signup', 'sign', 'register', 'join', 'start', 'started', 'schedule', 'appointment'],
        free: ['free', 'trial', 'complimentary', 'sample', 'consultation', 'consult', 'intro', 'introductory'],
        tutor: ['tutor', 'tutors', 'tutoring', 'teacher', 'teachers', 'teach', 'teaches', 'teaching', 'mentor', 'mentors', 'staff', 'team'],
        online: ['online', 'zoom', 'virtual', 'remote', 'video'],
        inperson: ['person', 'offline', 'face', 'home', 'house', 'library', 'physical', 'irl'],
        contact: ['contact', 'email', 'phone', 'call', 'number', 'reach', 'message', 'text', 'whatsapp'],
        scaling: ['scaling', 'scaled', 'scale', 'scales', 'uac'],
        moderation: ['moderation', 'moderated', 'moderate', 'moderating', 'assessment', 'assessments', 'internal', 'rank', 'ranks', 'ranking'],
        alignment: ['alignment', 'aligned', 'align', 'band', 'bands', 'cutoff', 'cutoffs', 'nesa'],
        atar: ['atar', 'atars', 'uai'],
        cancel: ['cancel', 'cancellation', 'contract', 'contracts', 'lock', 'locked', 'commitment', 'commit', 'quit', 'stop', 'pause', 'leave'],
        group: ['group', 'groups', 'class', 'classes', 'foundation'],
        subject: ['subject', 'subjects', 'course', 'courses', 'cover', 'offer', 'offered']
    };

    /* ---------------- Intents ---------------- */
    const INTENTS = [
        {
            id: 'greeting',
            examples: ['hi', 'hello', 'hey', 'hey there', 'good morning', 'yo', 'sup', 'hi clarity', 'hello is anyone there'],
            answer: `Hey! I'm Clarity. Ask me about our tutors, subjects, pricing, booking, or how the HSC actually works.`,
            chips: [['Book a free session', 'free_trial'], ['How much is it?', 'pricing'], ['How does scaling work?', 'scaling']]
        },
        {
            id: 'thanks',
            examples: ['thanks', 'thank you', 'thanks heaps', 'cheers', 'ty', 'that helps', 'awesome thanks', 'perfect thank you', 'ok great'],
            answer: `Anytime. If you're ready, the next step is a free session with one of our tutors.`,
            chips: [['Book a free session', 'free_trial'], ['Meet the tutors', 'tutors_overview']]
        },
        {
            id: 'bye',
            examples: ['bye', 'goodbye', 'see ya', 'that is all', 'no more questions', 'im done'],
            answer: `Good luck with the HSC! I'm here whenever you need me.`
        },
        {
            id: 'bot_identity',
            examples: ['who are you', 'what are you', 'are you a bot', 'are you a real person', 'are you ai', 'is this chatgpt', 'am i talking to a human', 'what is clarity'],
            answer: `I'm Clarity, the Claritas site assistant. I match your question to answers written by our team, so I won't make things up. For anything I can't answer, a real human is at ${MAIL}.`
        },
        {
            id: 'about',
            examples: ['what is claritas', 'what is claritas academics', 'tell me about claritas', 'who are you guys', 'what do you do', 'what is this website', 'what kind of tutoring is this', 'tell me about the company', 'who runs claritas'],
            answer: `Claritas Academics is a student-founded HSC tutoring business in Sydney. Our tutors scored 97 to 99+ ATARs, and we don't just teach content. We teach how the HSC system works: moderation, alignment and scaling, plus exam technique.<br><br>Clarity. Confidence. Results.`,
            chips: [['Meet the tutors', 'tutors_overview'], ['Pricing', 'pricing'], ['Your philosophy', 'philosophy']]
        },
        {
            id: 'pricing',
            examples: ['how much does it cost', 'what are your prices', 'how much is tutoring', 'pricing', 'what do you charge', 'how much per hour', 'what is the hourly rate', 'is it expensive', 'how much for a lesson', 'cost of a session', 'fees', 'how much is online tutoring', 'price of in person lessons'],
            answer: `Three options, all per hour:<br>
<ul><li><b>Foundation, $40/hr</b>: small group, in person (subject to availability)</li>
<li><b>Excellence, $60/hr</b>: 1:1 online. Our most popular</li>
<li><b>Premium, $70/hr</b>: 1:1 in person, at home or a library</li></ul>
No lock-in contracts, no hidden fees, and your first session is free. <a href="/#pricing">See full pricing</a>`,
            chips: [['Book a free session', 'free_trial'], ['Online or in person?', 'delivery'], ['Why so affordable?', 'why_cheaper']]
        },
        {
            id: 'plan_compare',
            examples: ['what is the difference between the plans', 'which plan should i choose', 'excellence vs premium', 'foundation vs excellence', 'which package is best', 'what does premium include', 'what do i get with excellence', 'compare the options'],
            answer: `Quick breakdown:<br>
<ul><li><b>Foundation ($40/hr)</b>: group class, technique-driven teaching, instant marking and feedback</li>
<li><b>Excellence ($60/hr)</b>: 1:1 online, flexible scheduling, greater availability, progress reports</li>
<li><b>Premium ($70/hr)</b>: 1:1 in person at home or a library, detailed feedback and correction, progress reports</li></ul>
Most students pick Excellence. Not sure? Talk it through in your free session.`,
            chips: [['Book a free session', 'free_trial'], ['Group classes', 'group_classes']]
        },
        {
            id: 'group_classes',
            examples: ['do you have group classes', 'group tutoring', 'can i do a group session', 'foundation plan', 'small group lessons', 'can i learn with friends', 'are there classes'],
            answer: `Yes. Our <b>Foundation</b> option is an in-person group session at $40/hr, with technique-driven teaching, instant marking and exam writing tips. It depends on availability, so email ${MAIL} or ask in your free session to see what's running.`,
            chips: [['All pricing', 'pricing'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'free_trial',
            examples: ['is there a free trial', 'do you offer a free session', 'can i try a lesson first', 'first lesson free', 'free consultation', 'trial lesson', 'sample lesson', 'can i test it out before paying', 'what happens in the free session'],
            answer: `Yes, your first session is free. You meet a tutor, talk through your goals and availability, and build a plan together. You can also take a short sample lesson to see how we teach.<br><br>Pick a tutor on the <a href="/tutors.html">tutors page</a> and hit <b>Book Now</b>.`,
            chips: [['Which tutor is right for me?', 'tutors_overview'], ['How much after that?', 'pricing']]
        },
        {
            id: 'how_to_book',
            examples: ['how do i book', 'how do i sign up', 'how do i get started', 'i want to book a lesson', 'how do i enrol', 'book now', 'i want a tutor', 'how can i join', 'where do i book', 'how do i schedule a session'],
            answer: (e, kb) => {
                if (e.tutors.length) {
                    return e.tutors.map(t => `Book with ${t.first} here: <a href="${t.cal}" target="_blank" rel="noopener">${t.cal.replace('https://', '')}</a>`).join('<br>') +
                        `<br><br>Your first session is free.`;
                }
                return `Easy: <ol><li>Pick a tutor on the <a href="/tutors.html">tutors page</a></li><li>Hit <b>Book Now</b> and choose a time on their calendar</li><li>Your first session is free. You'll make a plan together from there</li></ol>Tell me your subjects and I'll suggest a tutor.`;
            },
            chips: [['Who teaches what?', 'subjects_list'], ['Pricing', 'pricing']]
        },
        {
            id: 'tutors_overview',
            examples: ['who are your tutors', 'who are the tutors', 'tell me about the tutors', 'meet the team', 'what atars did your tutors get', 'are your tutors qualified', 'who will be teaching me', 'how good are the tutors', 'how do you pick tutors'],
            answer: (e, kb) => `Every tutor scored a 97+ ATAR (98.4 average):<ul>` +
                kb.TUTORS.map(t => `<li><a href="/tutors.html#${t.id}"><b>${t.name}</b></a> (${t.atar}): ${kb.subjectList(t.subjects)}</li>`).join('') +
                `</ul>Ask me about any of them, or tell me your subject.`,
            chips: [['Who teaches Ext 2?', 'subject_tutors'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'tutor_profile',
            examples: ['tell me about ayush', 'who is ned', 'what did tarun get', 'what subjects does aditya teach', 'is ayush a good tutor', 'more about ned reside', 'what atar did aditya get', 'who is the founder'],
            answer: (e, kb) => {
                const list = e.tutors.length ? e.tutors : [kb.TUTORS[0]];
                return list.map(t => `<b>${t.name}</b>, ${t.atar} ATAR<br>${t.bio}<br>Teaches: ${kb.subjectList(t.subjects)}.<br><a href="/tutors.html#${t.id}">Full profile</a> · <a href="${t.cal}" target="_blank" rel="noopener">Book a free session</a>`).join('<br><br>');
            },
            chips: [['All tutors', 'tutors_overview'], ['Pricing', 'pricing']]
        },
        {
            id: 'subject_tutors',
            examples: ['who teaches chemistry', 'do you tutor physics', 'i need help with extension 2', 'do you have an english tutor', 'tutor for maths advanced', 'can someone help me with biology', 'do you do legal studies', 'is there a software engineering tutor', 'who can help with 4u', 'i am struggling with chem'],
            answer: (e, kb) => {
                const ids = e.subjects.length ? e.subjects : [];
                if (!ids.length) return kb.intent('subjects_list').answer(e, kb);
                const lines = ids.map(sid => {
                    const tutors = kb.TUTORS.filter(t => t.subjects.includes(sid));
                    const names = tutors.map(t => `<a href="/tutors.html#${t.id}">${t.name}</a> (${t.atar})`);
                    return `<b>${kb.SUBJECTS[sid].name}</b>: ${kb.joinList(names)}`;
                });
                return `Yes, we've got you:<br>${lines.join('<br>')}<br><br>Click a name for their profile, or book a free session from there.`;
            },
            chips: [['Book a free session', 'free_trial'], ['Pricing', 'pricing']]
        },
        {
            id: 'subjects_list',
            examples: ['what subjects do you teach', 'what subjects do you offer', 'which courses do you cover', 'list of subjects', 'what can you help with', 'do you cover all subjects'],
            answer: (e, kb) => `We cover:<ul>
<li><b>Maths</b>: Standard, Advanced, Extension 1, Extension 2</li>
<li><b>Science</b>: Physics, Chemistry, Biology</li>
<li><b>English</b>: Standard, Advanced</li>
<li><b>Humanities</b>: Legal Studies, Modern History, Ancient History, Business Studies</li>
<li><b>Technology</b>: Software Engineering</li></ul>Tell me a subject and I'll tell you who teaches it.`,
            chips: [['Who teaches Ext 2?', 'subject_tutors'], ['Meet the tutors', 'tutors_overview']]
        },
        {
            id: 'unsupported_subject',
            examples: ['do you tutor economics', 'do you teach geography', 'can you help with pdhpe', 'do you have a french tutor', 'english extension tutor'],
            answer: (e, kb) => {
                const what = e.unsupported.length ? `<b>${kb.titleCase(e.unsupported[0])}</b>` : 'that subject';
                return `We don't currently offer ${what}, sorry. Right now we cover Maths (Standard to Ext 2), Physics, Chemistry, Biology, English (Standard and Advanced), Legal Studies, Modern and Ancient History, Business Studies and Software Engineering.<br><br>Email ${MAIL} anyway. We're growing and want to know what students need.`;
            },
            chips: [['All subjects', 'subjects_list']]
        },
        {
            id: 'year_levels',
            examples: ['what years do you tutor', 'do you tutor year 10', 'is this for year 11', 'can my year 9 child join', 'do you teach year 12', 'what grades do you teach', 'do you help junior students', 'is it only for hsc', 'do you do primary school'],
            answer: (e) => {
                const y = e.year;
                if (y && y < 10) return `We focus on <b>Years 10 to 12</b>, building towards the HSC, so we don't currently take Year ${y} students. Year 10 is a great time to start though.`;
                return `We tutor <b>Years 10 to 12</b>. Year 10 builds the foundations, Year 11 sets up your courses, and Year 12 is all about ranks, exams and the HSC itself.`;
            },
            chips: [['Subjects', 'subjects_list'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'delivery',
            examples: ['is it online or in person', 'do you do face to face tutoring', 'can you come to my house', 'do you tutor online', 'where are lessons held', 'is tutoring on zoom', 'can we meet at a library', 'do you do home tutoring'],
            answer: `Both:<ul><li><b>Online 1:1</b> (Excellence, $60/hr): flexible scheduling, no travel</li>
<li><b>In person 1:1</b> (Premium, $70/hr): at your home or a library</li>
<li><b>In-person groups</b> (Foundation, $40/hr): subject to availability</li></ul>`,
            chips: [['Where are you based?', 'location'], ['Pricing', 'pricing']]
        },
        {
            id: 'location',
            examples: ['where are you located', 'where are you based', 'do you tutor in parramatta', 'what areas do you cover', 'do you come to my suburb', 'are you in sydney', 'can you travel to me', 'do you service western sydney'],
            answer: `We're based in Sydney. In-person lessons happen at your home or a local library, depending on which tutor can get to you. Mention your suburb when you book and we'll sort it out. Online lessons work from anywhere in NSW.`,
            chips: [['Online or in person?', 'delivery'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'scheduling',
            examples: ['how long are the lessons', 'how often are sessions', 'how many lessons a week', 'what times are available', 'can i do weekends', 'do you tutor after school', 'how long is a session', 'when are you available', 'can i change my lesson time'],
            answer: `Lesson length and frequency are set with your tutor, based on your goals and timetable. Pricing is per hour. Each tutor's live availability is on their booking calendar, so check the <a href="/tutors.html">tutors page</a> and hit <b>Book Now</b> to see open times. Online 1:1 has the most flexibility.`,
            chips: [['Book a free session', 'free_trial'], ['Pricing', 'pricing']]
        },
        {
            id: 'contracts',
            examples: ['is there a contract', 'is there a lock in', 'can i cancel anytime', 'do i have to commit for a term', 'can i stop whenever i want', 'can i pause lessons', 'what is the cancellation policy', 'are there hidden fees', 'do i have to pay upfront for a term'],
            answer: `No lock-ins and no hidden fees. You can pause or leave any time. We'd rather earn your trust than trap it. For specifics on rescheduling a booked lesson, email ${MAIL}.`,
            chips: [['Pricing', 'pricing'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'payment',
            examples: ['how do i pay', 'what payment methods do you accept', 'do you take card', 'can i pay by bank transfer', 'when do i pay', 'do you send invoices', 'payment options'],
            answer: `Payment is sorted directly with us after your free session. For details, email ${MAIL} or call ${TEL}.`,
            chips: [['Pricing', 'pricing'], ['Contact us', 'contact']]
        },
        {
            id: 'discounts',
            examples: ['do you have discounts', 'is there a sibling discount', 'any deals', 'discount for multiple subjects', 'package deals', 'bulk discount', 'student discount', 'promo code'],
            answer: `We keep pricing low and simple instead of running deals. If you're booking multiple subjects or siblings, mention it in your free session or email ${MAIL} and we'll see what we can do.`,
            chips: [['Pricing', 'pricing'], ['Why so affordable?', 'why_cheaper']]
        },
        {
            id: 'why_cheaper',
            examples: ['why are you cheaper', 'why is it so cheap', 'how are your prices so low', 'why choose you over a tutoring centre', 'what makes you different', 'why should i pick claritas', 'what is your competitive advantage', 'why not a big tutoring college'],
            answer: `We're a student-founded startup with no expensive buildings, big ad budgets or layers of management. So you get tutors who'd typically charge $100 to $150/hr at big centres, for $40 to $70/hr.<br><br>And we teach the system, not just the content: how moderation, alignment and scaling turn your marks into an ATAR.`,
            chips: [['Meet the tutors', 'tutors_overview'], ['Our philosophy', 'philosophy']]
        },
        {
            id: 'philosophy',
            examples: ['what is your teaching philosophy', 'how do you teach', 'what is your approach', 'clarity confidence results', 'what is your method', 'how are lessons structured', 'what happens in a lesson'],
            answer: `Three stages:<ul><li><b>Clarity</b>: explanations that actually click, fixing the small misunderstandings that waste hours</li>
<li><b>Confidence</b>: targeted practice on the questions students find hardest, plus our own notes, formula sheets and frameworks</li>
<li><b>Results</b>: exam strategy, marking criteria, and time management so preparation turns into marks</li></ul><a href="/#philosophy">Read more</a>`,
            chips: [['How the HSC works', 'hsc_system'], ['Meet the tutors', 'tutors_overview']]
        },
        {
            id: 'hsc_system',
            examples: ['how does the hsc work', 'explain the hsc system', 'how do hsc marks work', 'teach the system', 'how are hsc marks calculated', 'how do i game the hsc'],
            answer: `Your HSC mark goes through three machines:<ol><li><b>Moderation</b>: school marks are refit to your cohort's exam results. Your rank is what survives</li>
<li><b>Alignment</b>: raw exam marks are mapped onto bands. A raw 75 can become a 90</li>
<li><b>Scaling</b>: UAC adjusts every subject by cohort strength before your ATAR</li></ol>Ask me about any one, or try the calculators on the <a href="/blogs.html">blog</a>.`,
            chips: [['Moderation', 'moderation'], ['Alignment', 'alignment'], ['Scaling', 'scaling']]
        },
        {
            id: 'moderation',
            examples: ['what is moderation', 'how does moderation work', 'explain moderation', 'how are school marks moderated', 'does my rank matter', 'why is my internal rank important', 'what happens to my assessment marks', 'my school is bad will moderation hurt me', 'how do assessment marks get adjusted'],
            answer: `Your school assessment marks get <b>moderated</b> against your whole school cohort's HSC exam results. Your marks are reshaped, but your <b>rank</b> stays the same. That's why rank is everything. And if your cohort does well in the exam, everyone's assessment marks lift.<br><br>Try our interactive calculator: <a href="/blog/hsc-moderation-explained.html">HSC Moderation Explained</a>`,
            chips: [['Alignment', 'alignment'], ['Scaling', 'scaling']]
        },
        {
            id: 'alignment',
            examples: ['what is alignment', 'how does alignment work', 'explain alignment', 'raw marks vs aligned marks', 'what raw mark do i need for a band 6', 'how do bands work', 'band 6 cutoff', 'why is my raw mark lower than my hsc mark'],
            answer: `NESA <b>aligns</b> raw exam marks onto band standards (Band 6 = 90+), so a raw mark like 75 can come out as a 90. Knowing where the cutoffs sit tells you which marks are worth chasing.<br><br>Play with the simulator: <a href="/blog/hsc-alignment-explained.html">HSC Alignment Explained</a>`,
            chips: [['Moderation', 'moderation'], ['Scaling', 'scaling']]
        },
        {
            id: 'scaling',
            examples: ['what is scaling', 'how does scaling work', 'explain hsc scaling', 'which subjects scale well', 'does ext 2 scale well', 'what is the best scaling subject', 'should i pick subjects for scaling', 'how does uac scale marks'],
            answer: `Before your ATAR is calculated, UAC <b>scales</b> every subject based on how strong its students are. Strong ranks in strongly scaled subjects compound. But a high rank in a lower-scaling subject can beat a weak rank in a high-scaling one, so pick what you're good at too.<br><br>Test it with 2025 data: <a href="/blog/hsc-scaling-explained.html">HSC Scaling Explained</a>`,
            chips: [['How is the ATAR calculated?', 'atar'], ['Moderation', 'moderation']]
        },
        {
            id: 'atar',
            examples: ['how is the atar calculated', 'what is an atar', 'how do i get a 99 atar', 'how do i improve my atar', 'what atar do i need', 'is atar a mark or a rank', 'how many units count towards atar', 'how do i calculate my atar', 'atar calculator'],
            answer: `Your ATAR is a <b>rank</b>, not a mark. UAC takes your scaled marks from your best 10 units (including at least 2 units of English) and ranks you against your age group.<br><br>Getting a high one means owning your school rank, knowing the band cutoffs, and understanding scaling. That's what we teach. Start with <a href="/blog/hsc-scaling-explained.html">how scaling works</a>.`,
            chips: [['Scaling', 'scaling'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'founder_story',
            examples: ['does going to a non selective school matter', 'i go to a bad school', 'can i get a high atar at a public school', 'my school is not selective', 'what is ayushs story', 'how did the founder get 99.30', 'does my school affect my atar'],
            answer: `Your school doesn't decide your ATAR. The system does.<br><br>Our founder Ayush moved to Australia in Year 10 and ended up at a non-selective school. He learnt how moderation, alignment and scaling work, became the top of his cohort, and finished with a <b>99.30</b>, the highest in his school's history. At a non-selective school, you have to become the curve.<br><br><a href="/tutors.html#tutor1">Read Ayush's story</a>`,
            chips: [['Moderation', 'moderation'], ['Book with Ayush', 'how_to_book']]
        },
        {
            id: 'results',
            examples: ['do you get results', 'what results have your students got', 'do you have reviews', 'testimonials', 'is claritas legit', 'are you any good', 'how many students have you helped', 'success rate'],
            answer: `30+ happy clients so far, and our tutors average a 98.4 ATAR. You can read what students say in the <a href="/#testimonials">reviews section</a> on our homepage. Best test though: a free session.`,
            chips: [['Book a free session', 'free_trial'], ['Meet the tutors', 'tutors_overview']]
        },
        {
            id: 'progress_reports',
            examples: ['do parents get updates', 'do you send progress reports', 'how will i know my child is improving', 'will i get feedback as a parent', 'do you track progress'],
            answer: `Yes. Our 1:1 plans (Excellence and Premium) include progress reports, so parents can see what's been covered and where things are heading.`,
            chips: [['Pricing', 'pricing'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'exam_prep',
            examples: ['can you help me prepare for trials', 'help with hsc exams', 'exam preparation', 'can you mark my essays', 'do you do past papers', 'i have an exam next week', 'help with assessments', 'can you help with my assignment', 'last minute exam help'],
            answer: `That's what we do. Lessons go straight to what gets marked: past papers, marking criteria, and the questions students find hardest. Our tutors give detailed feedback on essays and written responses too. If your exam is close, book a free session now and say so. We'll prioritise.`,
            chips: [['Book a free session', 'free_trial'], ['Study resources', 'resources']]
        },
        {
            id: 'resources',
            examples: ['do you have free resources', 'study notes', 'software engineering textbook', 'do you have past papers', 'free study guides', 'resources page', 'seng textbook pdf', 'where can i find practice questions'],
            answer: `Free stuff:<ul><li><a href="/resources.html">Resources page</a>: including our full <b>Software Engineering textbook</b> (free PDF)</li>
<li><a href="/blog/hsc-maths-science-software-resources.html">Maths, Science and Software resources guide</a>: where 99+ ATAR students actually find past papers</li>
<li><a href="/blogs.html">Blog</a>: guides and interactive calculators</li></ul>`,
            chips: [['Study tips', 'study_tips'], ['Blog', 'blog']]
        },
        {
            id: 'study_tips',
            examples: ['how should i study', 'study tips', 'how do i study for maths', 'how do top students study', 'how many hours should i study', 'i keep procrastinating', 'how to get a band 6', 'best way to revise'],
            answer: `Short version: do past papers early, find the exact concept you're stuck on instead of re-reading, and know what the marking criteria want. Our <a href="/blog/hsc-maths-science-software-resources.html">99+ ATAR study guide</a> lays out the full system. A tutor can make it specific to you.`,
            chips: [['Free resources', 'resources'], ['Book a free session', 'free_trial']]
        },
        {
            id: 'related_rates',
            examples: ['related rates', 'help with related rates', 'ext 2 related rates mistakes', 'rates of change questions', 'calculus rates question'],
            answer: `We wrote a guide on exactly that: <a href="/blog/ext2-related-rates-mistakes.html">5 Mistakes That Sink Ext 2 Related Rates Questions</a>. For 1:1 help, Ayush and Tarun teach Extension Maths.`,
            chips: [['Ext 2 tutors', 'subject_tutors']]
        },
        {
            id: 'blog',
            examples: ['do you have a blog', 'blog posts', 'articles', 'where are your guides', 'show me the blog', 'calculators'],
            answer: `Our <a href="/blogs.html">blog</a> has free HSC guides with interactive tools: scaling simulator, alignment simulator, moderation calculator, a study resources guide, and Ext 2 tips.`,
            chips: [['Scaling', 'scaling'], ['Free resources', 'resources']]
        },
        {
            id: 'contact',
            examples: ['how do i contact you', 'what is your email', 'what is your phone number', 'can i call you', 'i want to talk to a human', 'speak to a real person', 'customer service', 'how do i reach you'],
            answer: `Reach a human here:<ul><li>Email: ${MAIL}</li><li>Phone: ${TEL}</li><li>Instagram: <a href="https://www.instagram.com/claritas_academics" target="_blank" rel="noopener">@claritas_academics</a></li></ul>`,
            chips: [['Book a free session', 'free_trial'], ['Socials and Discord', 'socials']]
        },
        {
            id: 'socials',
            examples: ['do you have a discord', 'instagram', 'facebook page', 'social media', 'linkedin', 'tiktok', 'is there a community'],
            answer: `Find us here:<ul><li><a href="https://discord.gg/2Qdegg3XfH" target="_blank" rel="noopener">Discord</a>: our student community</li><li><a href="https://www.instagram.com/claritas_academics" target="_blank" rel="noopener">Instagram</a></li><li><a href="https://www.linkedin.com/company/claritas-academics/about/" target="_blank" rel="noopener">LinkedIn</a></li></ul>`,
            chips: [['Contact us', 'contact']]
        },
        {
            id: 'jobs',
            examples: ['are you hiring', 'can i become a tutor', 'how do i tutor for claritas', 'tutoring jobs', 'i want to work for you', 'do you need tutors'],
            answer: `Keen to tutor with us? Email ${MAIL} with your ATAR, your HSC subjects and results, and a bit about why you want to teach.`,
            chips: [['Meet the tutors', 'tutors_overview']]
        }
    ];

    /* Short labels used when Clarity isn't sure and offers options */
    const LABELS = {
        about: 'About Claritas', pricing: 'Pricing', plan_compare: 'Comparing plans', group_classes: 'Group classes',
        free_trial: 'Free first session', how_to_book: 'How to book', tutors_overview: 'Our tutors', tutor_profile: 'A tutor\'s profile',
        subject_tutors: 'Who teaches a subject', subjects_list: 'Subjects we cover', year_levels: 'Year levels', delivery: 'Online vs in person',
        location: 'Where we are', scheduling: 'Lesson times and length', contracts: 'Contracts and cancelling', payment: 'Paying',
        discounts: 'Discounts', why_cheaper: 'Why we\'re affordable', philosophy: 'How we teach', hsc_system: 'How the HSC works',
        moderation: 'Moderation', alignment: 'Alignment', scaling: 'Scaling', atar: 'How the ATAR works', founder_story: 'Non-selective schools',
        results: 'Results and reviews', progress_reports: 'Progress reports', exam_prep: 'Exam prep', resources: 'Free resources',
        study_tips: 'Study tips', related_rates: 'Related rates', blog: 'The blog', contact: 'Contact us', socials: 'Socials and Discord',
        jobs: 'Tutoring for us', bot_identity: 'About Clarity'
    };

    const FALLBACK = {
        answer: `Hmm, I don't have a good answer for that one yet. I'm a simple assistant with answers written by our team, so for anything else, a human can help at ${MAIL} or ${TEL}.`,
        chips: [['Pricing', 'pricing'], ['Book a free session', 'free_trial'], ['Who teaches what?', 'subjects_list']]
    };

    const WELCOME = {
        answer: `Hi, I'm <b>Clarity</b> 👋 Ask me anything about Claritas: tutors, subjects, pricing, booking, or how the HSC really works.`,
        chips: [['How much is it?', 'pricing'], ['Book a free session', 'free_trial'], ['Who teaches Ext 2?', 'subject_tutors'], ['How does scaling work?', 'scaling']]
    };

    /* ---------------- Helpers used by answers ---------------- */
    const KB = {
        TUTORS, SUBJECTS, SUBJECT_GROUPS, UNSUPPORTED, SYNONYMS, INTENTS, LABELS, FALLBACK, WELCOME, EMAIL,
        intent(id) { return INTENTS.find(i => i.id === id); },
        tutorById(id) { return TUTORS.find(t => t.id === id); },
        joinList(arr) {
            if (arr.length <= 1) return arr.join('');
            return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
        },
        subjectList(ids) { return KB.joinList(ids.map(id => SUBJECTS[id].name)); },
        titleCase(s) { return s.replace(/\b\w/g, c => c.toUpperCase()).replace(/\bAnd\b/g, 'and').replace(/\bOf\b/g, 'of'); }
    };

    root.CLARITY_KB = KB;
    if (typeof module !== 'undefined' && module.exports) module.exports = KB;

})(typeof window !== 'undefined' ? window : globalThis);
