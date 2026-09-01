/* ============================================================
   js/alignment-sim.js — HSC Alignment interactive simulator
   Used in: blog/hsc-alignment-explained.html
   ============================================================ */

'use strict';

// Band cutoff presets (raw marks out of 100)
const presets = {
    hard:     { b6: 74, b5: 58, b4: 45, b3: 35, b2: 25 },
    standard: { b6: 82, b5: 68, b4: 55, b3: 42, b2: 30 },
    easy:     { b6: 88, b5: 76, b4: 64, b3: 50, b2: 35 }
};

let currentCutoffs = { ...presets.hard };

/**
 * Apply a difficulty preset (hard / standard / easy) and refresh the sim.
 * @param {string} type - key from presets object
 * @param {HTMLElement|null} btn - the clicked preset button (for active styling)
 */
function applyPreset(type, btn) {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    currentCutoffs = { ...presets[type] };
    document.getElementById('b6Cutoff').value = currentCutoffs.b6;
    document.getElementById('b5Cutoff').value = currentCutoffs.b5;
    document.getElementById('b6CutoffVal').innerText = `${currentCutoffs.b6} / 100`;
    document.getElementById('b5CutoffVal').innerText = `${currentCutoffs.b5} / 100`;

    updateAlignmentSim();
}

/**
 * Called when the user manually moves the cutoff sliders.
 * Removes any active preset highlight and recalculates.
 */
function updateCustomCutoff() {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));

    const b6 = parseInt(document.getElementById('b6Cutoff').value);
    let b5 = parseInt(document.getElementById('b5Cutoff').value);

    // Ensure B5 is always below B6
    if (b5 >= b6) {
        b5 = b6 - 5;
        document.getElementById('b5Cutoff').value = b5;
    }

    document.getElementById('b6CutoffVal').innerText = `${b6} / 100`;
    document.getElementById('b5CutoffVal').innerText = `${b5} / 100`;

    currentCutoffs.b6 = b6;
    currentCutoffs.b5 = b5;
    // Proportionally adjust lower bands relative to B5
    currentCutoffs.b4 = Math.round(b5 * 0.78);
    currentCutoffs.b3 = Math.round(b5 * 0.58);
    currentCutoffs.b2 = Math.round(b5 * 0.40);

    updateAlignmentSim();
}

/**
 * Piecewise linear interpolation: maps raw mark → aligned (0–100) mark.
 * @param {number} raw - raw exam mark
 * @param {object} cutoffs - { b2, b3, b4, b5, b6 } raw band boundaries
 * @returns {number} aligned mark (integer)
 */
function calculateAlignedMark(raw, cutoffs) {
    if (raw >= 100) return 100;
    if (raw >= cutoffs.b6) {
        return Math.round(90 + ((raw - cutoffs.b6) / (100 - cutoffs.b6)) * 10);
    }
    if (raw >= cutoffs.b5) {
        return Math.round(80 + ((raw - cutoffs.b5) / (cutoffs.b6 - cutoffs.b5)) * 10);
    }
    if (raw >= cutoffs.b4) {
        return Math.round(70 + ((raw - cutoffs.b4) / (cutoffs.b5 - cutoffs.b4)) * 10);
    }
    if (raw >= cutoffs.b3) {
        return Math.round(60 + ((raw - cutoffs.b3) / (cutoffs.b4 - cutoffs.b3)) * 10);
    }
    if (raw >= cutoffs.b2) {
        return Math.round(50 + ((raw - cutoffs.b2) / (cutoffs.b3 - cutoffs.b2)) * 10);
    }
    return Math.round((raw / cutoffs.b2) * 50);
}

/**
 * Read slider inputs, compute aligned result, and update all DOM elements.
 */
function updateAlignmentSim() {
    const raw = parseInt(document.getElementById('rawInput').value);
    document.getElementById('rawInputVal').innerText = `${raw} / 100`;

    const aligned = calculateAlignedMark(raw, currentCutoffs);
    document.getElementById('alignedResult').innerText = aligned;

    // Determine band label
    let bandText = 'Band 1';
    if (aligned >= 90)      bandText = 'Band 6 (E4)';
    else if (aligned >= 80) bandText = 'Band 5 (E3)';
    else if (aligned >= 70) bandText = 'Band 4 (E2)';
    else if (aligned >= 60) bandText = 'Band 3 (E1)';
    else if (aligned >= 50) bandText = 'Band 2';

    document.getElementById('bandResult').innerText = bandText;

    // Explanation text
    let explanation = '';
    if (aligned >= 90) {
        explanation = `Your raw score of ${raw} reaches the Band 6 cutoff (${currentCutoffs.b6}), giving you an aligned mark of ${aligned}!`;
    } else if (aligned >= 80) {
        explanation = `Your raw score of ${raw} is within the Band 5 bracket (${currentCutoffs.b5} to ${currentCutoffs.b6 - 1}), aligning to ${aligned}.`;
    } else {
        explanation = `Your raw score of ${raw} maps to an aligned mark of ${aligned} (${bandText}).`;
    }
    document.getElementById('resultExplanation').innerText = explanation;

    // Spectrum bar segment widths
    document.getElementById('segB6').style.width = `${100 - currentCutoffs.b6}%`;
    document.getElementById('segB5').style.width = `${currentCutoffs.b6 - currentCutoffs.b5}%`;
    document.getElementById('segB4').style.width = `${currentCutoffs.b5 - currentCutoffs.b4}%`;
    document.getElementById('segB3').style.width = `${currentCutoffs.b4 - currentCutoffs.b3}%`;
    document.getElementById('segB2').style.width = `${currentCutoffs.b3}%`;

    // Marker position (raw mark as % of 100)
    document.getElementById('spectrumMarker').style.left = `${raw}%`;
    document.getElementById('spectrumRawIndicator').innerText = `Your Raw Mark: ${raw}/100`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateAlignmentSim();
});
