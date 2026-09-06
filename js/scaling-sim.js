/* ============================================================
   js/scaling-sim.js — HSC Scaling Interactive Simulator (2025 UAC Data)
   Claritas Academics
   ============================================================ */

'use strict';

// 2025 UAC Table A3 scaling parameters (1-unit basis: 0-50)
const SCALING_DATA_2025 = {
    "Mathematics Extension 2": {
        units: 1,
        cand: 3844,
        hsc: { mean: 41.5, sd: 6.3, max: 50.0, p99: 49.5, p90: 48.0, p75: 46.5, p50: 43.5, p25: 37.5 },
        sca: { mean: 43.4, sd: 5.3, max: 50.0, p99: 49.6, p90: 48.3, p75: 46.9, p50: 44.7, p25: 41.5 }
    },
    "Mathematics Extension 1": {
        units: 1,
        cand: 9279,
        hsc: { mean: 39.7, sd: 8.0, max: 50.0, p99: 49.5, p90: 48.0, p75: 46.0, p50: 42.0, p25: 35.0 },
        sca: { mean: 39.7, sd: 7.5, max: 50.0, p99: 49.5, p90: 47.2, p75: 44.9, p50: 41.5, p25: 36.6 }
    },
    "Mathematics Advanced": {
        units: 2,
        cand: 16809,
        hsc: { mean: 39.6, sd: 6.1, max: 50.0, p99: 49.0, p90: 47.0, p75: 44.5, p50: 40.0, p25: 36.0 },
        sca: { mean: 31.9, sd: 9.4, max: 50.0, p99: 47.5, p90: 42.9, p75: 38.9, p50: 33.2, p25: 25.9 }
    },
    "Mathematics Standard 2": {
        units: 2,
        cand: 31762,
        hsc: { mean: 36.0, sd: 6.6, max: 49.5, p99: 47.5, p90: 44.5, p75: 40.5, p50: 36.5, p25: 32.0 },
        sca: { mean: 23.3, sd: 10.2, max: 47.1, p99: 42.9, p90: 37.3, p75: 31.5, p50: 23.2, p25: 15.1 }
    },
    "Mathematics Standard 1 Exam": {
        units: 2,
        cand: 3737,
        hsc: { mean: 35.5, sd: 5.5, max: 49.0, p99: 47.0, p90: 42.0, p75: 39.0, p50: 35.5, p25: 32.5 },
        sca: { mean: 13.9, sd: 9.0, max: 36.0, p99: 34.7, p90: 27.7, p75: 20.2, p50: 12.5, p25: 6.6 }
    },
    "English Advanced": {
        units: 2,
        cand: 26292,
        hsc: { mean: 41.1, sd: 3.3, max: 49.5, p99: 47.5, p90: 45.5, p75: 43.5, p50: 41.0, p25: 39.0 },
        sca: { mean: 32.8, sd: 8.0, max: 50.0, p99: 46.9, p90: 42.6, p75: 38.9, p50: 33.7, p25: 27.7 }
    },
    "English Standard": {
        units: 2,
        cand: 33651,
        hsc: { mean: 36.0, sd: 3.7, max: 49.0, p99: 44.0, p90: 40.0, p75: 38.5, p50: 36.5, p25: 34.0 },
        sca: { mean: 20.4, sd: 8.2, max: 49.3, p99: 39.7, p90: 31.5, p75: 26.1, p50: 20.0, p25: 14.5 }
    },
    "English Extension 1": {
        units: 1,
        cand: 3691,
        hsc: { mean: 42.8, sd: 4.5, max: 50.0, p99: 49.0, p90: 47.0, p75: 46.0, p50: 44.0, p25: 41.0 },
        sca: { mean: 36.1, sd: 6.7, max: 50.0, p99: 48.3, p90: 43.9, p75: 40.9, p50: 36.9, p25: 32.2 }
    },
    "English Extension 2": {
        units: 1,
        cand: 1423,
        hsc: { mean: 41.5, sd: 5.3, max: 50.0, p99: 49.0, p90: 48.0, p75: 46.0, p50: 42.0, p25: 38.0 },
        sca: { mean: 35.8, sd: 6.6, max: 50.0, p99: 48.1, p90: 44.0, p75: 40.5, p50: 36.5, p25: 31.9 }
    },
    "English EALD": {
        units: 2,
        cand: 1504,
        hsc: { mean: 35.4, sd: 6.1, max: 49.5, p99: 47.0, p90: 43.0, p75: 39.5, p50: 35.5, p25: 32.0 },
        sca: { mean: 21.3, sd: 11.3, max: 48.6, p99: 45.3, p90: 37.6, p75: 30.3, p50: 20.0, p25: 12.1 }
    },
    "Physics": {
        units: 2,
        cand: 8817,
        hsc: { mean: 37.0, sd: 6.4, max: 49.0, p99: 47.5, p90: 45.5, p75: 42.0, p50: 37.5, p25: 32.0 },
        sca: { mean: 31.0, sd: 9.9, max: 50.0, p99: 47.2, p90: 43.0, p75: 38.8, p50: 32.2, p25: 24.0 }
    },
    "Chemistry": {
        units: 2,
        cand: 10369,
        hsc: { mean: 37.6, sd: 5.8, max: 49.0, p99: 47.5, p90: 45.0, p75: 42.0, p50: 38.0, p25: 34.0 },
        sca: { mean: 32.0, sd: 9.9, max: 50.0, p99: 47.6, p90: 43.6, p75: 39.8, p50: 33.9, p25: 25.8 }
    },
    "Biology": {
        units: 2,
        cand: 20710,
        hsc: { mean: 36.7, sd: 6.3, max: 49.5, p99: 47.0, p90: 44.0, p75: 41.5, p50: 37.5, p25: 33.0 },
        sca: { mean: 26.2, sd: 10.5, max: 50.0, p99: 45.3, p90: 39.9, p75: 34.8, p50: 26.7, p25: 18.0 }
    },
    "Science Extension": {
        units: 1,
        cand: 855,
        hsc: { mean: 37.6, sd: 5.0, max: 49.0, p99: 47.0, p90: 44.0, p75: 41.0, p50: 38.0, p25: 35.0 },
        sca: { mean: 32.0, sd: 7.2, max: 49.3, p99: 46.4, p90: 41.0, p75: 37.1, p50: 32.5, p25: 27.2 }
    },
    "Economics": {
        units: 2,
        cand: 5741,
        hsc: { mean: 39.0, sd: 5.8, max: 50.0, p99: 48.0, p90: 45.5, p75: 43.5, p50: 40.0, p25: 35.5 },
        sca: { mean: 31.4, sd: 9.9, max: 50.0, p99: 47.1, p90: 43.0, p75: 38.9, p50: 33.0, p25: 25.0 }
    },
    "Business Studies": {
        units: 2,
        cand: 20452,
        hsc: { mean: 37.4, sd: 6.0, max: 49.5, p99: 48.0, p90: 45.0, p75: 42.0, p50: 37.5, p25: 33.0 },
        sca: { mean: 23.9, sd: 11.0, max: 50.0, p99: 45.6, p90: 39.2, p75: 32.6, p50: 23.4, p25: 15.1 }
    },
    "Legal Studies": {
        units: 2,
        cand: 10080,
        hsc: { mean: 37.8, sd: 6.6, max: 49.5, p99: 48.0, p90: 45.5, p75: 43.0, p50: 39.0, p25: 33.0 },
        sca: { mean: 25.3, sd: 11.2, max: 50.0, p99: 45.7, p90: 39.9, p75: 34.4, p50: 25.9, p25: 16.5 }
    },
    "Modern History": {
        units: 2,
        cand: 10953,
        hsc: { mean: 37.1, sd: 6.5, max: 49.5, p99: 47.5, p90: 45.0, p75: 41.5, p50: 38.0, p25: 33.5 },
        sca: { mean: 25.0, sd: 11.1, max: 50.0, p99: 46.0, p90: 39.2, p75: 33.7, p50: 25.8, p25: 16.6 }
    },
    "Ancient History": {
        units: 2,
        cand: 7495,
        hsc: { mean: 36.4, sd: 7.1, max: 50.0, p99: 47.5, p90: 44.5, p75: 41.5, p50: 37.5, p25: 32.0 },
        sca: { mean: 22.4, sd: 11.0, max: 48.8, p99: 44.4, p90: 37.4, p75: 30.9, p50: 22.5, p25: 13.7 }
    },
    "History Extension": {
        units: 1,
        cand: 1777,
        hsc: { mean: 40.5, sd: 5.2, max: 49.0, p99: 48.0, p90: 47.0, p75: 45.0, p50: 41.0, p25: 37.0 },
        sca: { mean: 32.7, sd: 7.7, max: 50.0, p99: 47.0, p90: 42.7, p75: 38.1, p50: 32.9, p25: 27.6 }
    },
    "Software Engineering": {
        units: 2,
        cand: 1768,
        hsc: { mean: 37.6, sd: 5.6, max: 49.0, p99: 48.0, p90: 44.5, p75: 41.5, p50: 38.0, p25: 34.5 },
        sca: { mean: 26.7, sd: 10.3, max: 50.0, p99: 47.3, p90: 40.5, p75: 34.6, p50: 27.2, p25: 19.0 }
    },
    "Enterprise Computing": {
        units: 2,
        cand: 1869,
        hsc: { mean: 37.0, sd: 5.3, max: 49.5, p99: 46.5, p90: 43.5, p75: 40.5, p50: 37.5, p25: 34.0 },
        sca: { mean: 23.8, sd: 10.9, max: 50.0, p99: 46.1, p90: 39.1, p75: 31.7, p50: 23.7, p25: 15.6 }
    },
    "Engineering Studies": {
        units: 2,
        cand: 2558,
        hsc: { mean: 36.8, sd: 5.6, max: 49.5, p99: 47.5, p90: 44.5, p75: 40.5, p50: 37.0, p25: 33.5 },
        sca: { mean: 26.2, sd: 10.0, max: 49.5, p99: 45.9, p90: 39.6, p75: 33.6, p50: 26.4, p25: 18.6 }
    },
    "PDH&PE": {
        units: 2,
        cand: 17852,
        hsc: { mean: 37.3, sd: 5.5, max: 49.0, p99: 47.0, p90: 44.5, p75: 41.5, p50: 37.5, p25: 33.5 },
        sca: { mean: 22.8, sd: 10.8, max: 48.6, p99: 43.5, p90: 37.3, p75: 31.3, p50: 22.8, p25: 14.2 }
    },
    "Studies of Religion I": {
        units: 1,
        cand: 8169,
        hsc: { mean: 38.8, sd: 5.4, max: 50.0, p99: 48.0, p90: 46.0, p75: 43.0, p50: 39.0, p25: 35.0 },
        sca: { mean: 27.7, sd: 9.3, max: 48.8, p99: 45.2, p90: 39.9, p75: 34.8, p50: 28.1, p25: 20.8 }
    },
    "Studies of Religion II": {
        units: 2,
        cand: 6731,
        hsc: { mean: 38.9, sd: 5.4, max: 49.5, p99: 48.0, p90: 45.0, p75: 43.0, p50: 39.5, p25: 36.0 },
        sca: { mean: 27.3, sd: 10.3, max: 50.0, p99: 46.0, p90: 40.5, p75: 35.4, p50: 28.1, p25: 19.7 }
    },
    "Visual Arts": {
        units: 2,
        cand: 9047,
        hsc: { mean: 40.9, sd: 3.9, max: 50.0, p99: 48.0, p90: 45.5, p75: 44.0, p50: 41.5, p25: 38.5 },
        sca: { mean: 21.7, sd: 11.2, max: 48.7, p99: 45.3, p90: 37.4, p75: 30.1, p50: 21.1, p25: 12.6 }
    },
    "Music 1": {
        units: 2,
        cand: 4681,
        hsc: { mean: 40.9, sd: 5.1, max: 49.5, p99: 48.5, p90: 46.5, p75: 44.5, p50: 42.0, p25: 38.5 },
        sca: { mean: 20.8, sd: 11.0, max: 46.7, p99: 43.8, p90: 36.4, p75: 29.0, p50: 20.4, p25: 12.0 }
    },
    "Music 2": {
        units: 2,
        cand: 762,
        hsc: { mean: 43.7, sd: 3.2, max: 50.0, p99: 49.5, p90: 48.0, p75: 46.0, p50: 44.0, p25: 41.0 },
        sca: { mean: 34.1, sd: 8.5, max: 50.0, p99: 48.7, p90: 44.9, p75: 40.8, p50: 35.1, p25: 27.6 }
    },
    "Music Extension": {
        units: 1,
        cand: 447,
        hsc: { mean: 46.2, sd: 4.1, max: 50.0, p99: 50.0, p90: 50.0, p75: 49.0, p50: 47.0, p25: 45.0 },
        sca: { mean: 35.9, sd: 10.3, max: 50.0, p99: 50.0, p90: 49.6, p75: 45.2, p50: 36.3, p25: 29.4 }
    },
    "Geography": {
        units: 2,
        cand: 4419,
        hsc: { mean: 38.0, sd: 6.0, max: 49.5, p99: 48.0, p90: 45.5, p75: 42.5, p50: 38.5, p25: 34.0 },
        sca: { mean: 25.2, sd: 11.4, max: 50.0, p99: 47.3, p90: 40.5, p75: 34.1, p50: 25.4, p25: 16.5 }
    },
    "French Continuers": {
        units: 2,
        cand: 520,
        hsc: { mean: 41.2, sd: 4.6, max: 49.5, p99: 49.0, p90: 47.0, p75: 45.0, p50: 41.5, p25: 38.0 },
        sca: { mean: 34.4, sd: 8.0, max: 50.0, p99: 48.0, p90: 44.2, p75: 40.5, p50: 35.4, p25: 29.7 }
    },
    "Japanese Continuers": {
        units: 2,
        cand: 794,
        hsc: { mean: 39.7, sd: 6.2, max: 50.0, p99: 49.0, p90: 47.0, p75: 44.5, p50: 40.5, p25: 36.0 },
        sca: { mean: 30.8, sd: 9.6, max: 50.0, p99: 47.6, p90: 42.4, p75: 38.1, p50: 32.1, p25: 25.1 }
    },
    "Chinese Continuers": {
        units: 2,
        cand: 334,
        hsc: { mean: 43.5, sd: 5.0, max: 49.5, p99: 49.5, p90: 48.5, p75: 47.5, p50: 45.5, p25: 40.5 },
        sca: { mean: 32.8, sd: 9.6, max: 50.0, p99: 48.6, p90: 43.5, p75: 40.2, p50: 35.0, p25: 26.0 }
    },
    "Latin Continuers": {
        units: 2,
        cand: 140,
        hsc: { mean: 44.1, sd: 4.4, max: 50.0, p99: 49.5, p90: 48.5, p75: 47.5, p50: 45.5, p25: 42.0 },
        sca: { mean: 40.5, sd: 7.3, max: 50.0, p99: 49.0, p90: 47.7, p75: 46.1, p50: 42.6, p25: 37.3 }
    }
};

// Table A9 (2025 ATAR vs lowest aggregate out of 500)
const ATAR_AGGREGATES_2025 = [
    { atar: 99.95, agg: 479.4 },
    { atar: 99.50, agg: 459.4 },
    { atar: 99.00, agg: 447.8 },
    { atar: 98.00, agg: 433.2 },
    { atar: 95.00, agg: 404.6 },
    { atar: 90.00, agg: 370.7 },
    { atar: 85.00, agg: 341.6 },
    { atar: 80.00, agg: 313.8 },
    { atar: 75.00, agg: 287.5 },
    { atar: 70.00, agg: 262.0 },
    { atar: 65.00, agg: 237.2 },
    { atar: 60.00, agg: 212.9 },
    { atar: 55.00, agg: 190.0 },
    { atar: 50.00, agg: 165.7 }
];

/**
 * Perform piecewise linear interpolation from HSC mark to Scaled mark using Table A3 & distribution anchors.
 */
function interpolateScaledMark(subData, hscInput) {
    const units = subData.units;
    const hsc1u = units === 2 ? hscInput / 2.0 : hscInput;
    const h = subData.hsc;
    const s = subData.sca;

    // Construct curve based on true Table A3 percentiles
    // [HSC_1U, Scaled_1U, Percentile]
    const rawPts = [
        [h.max, s.max, 99.9],
        [h.p99, s.p99, 99.0],
        [h.p90, s.p90, 90.0],
        [h.p75, s.p75, 75.0],
        [h.p50, s.p50, 50.0],
        [h.p25, s.p25, 25.0],
        [Math.max(15, h.p25 - 6), Math.max(2, s.p25 - 9), 10.0],
        [0.0, 0.0, 0.0]
    ];

    // Ensure strict monotonicity
    const cleaned = [];
    for (let i = 0; i < rawPts.length; i++) {
        const pt = rawPts[i];
        if (cleaned.length === 0 || pt[0] < cleaned[cleaned.length - 1][0]) {
            cleaned.push(pt);
        } else if (pt[0] === cleaned[cleaned.length - 1][0]) {
            cleaned[cleaned.length - 1][1] = Math.max(cleaned[cleaned.length - 1][1], pt[1]);
        }
    }

    let scaled1u = 0.0;
    let percentile = 0.0;

    if (hsc1u >= cleaned[0][0]) {
        scaled1u = cleaned[0][1];
        percentile = 99.9;
    } else if (hsc1u <= cleaned[cleaned.length - 1][0]) {
        scaled1u = 0.0;
        percentile = 0.0;
    } else {
        for (let i = 0; i < cleaned.length - 1; i++) {
            const hHigh = cleaned[i][0];
            const sHigh = cleaned[i][1];
            const pHigh = cleaned[i][2];

            const hLow = cleaned[i + 1][0];
            const sLow = cleaned[i + 1][1];
            const pLow = cleaned[i + 1][2];

            if (hsc1u >= hLow && hsc1u <= hHigh) {
                const ratio = hHigh > hLow ? (hsc1u - hLow) / (hHigh - hLow) : 0;
                scaled1u = sLow + ratio * (sHigh - sLow);
                percentile = pLow + ratio * (pHigh - pLow);
                break;
            }
        }
    }

    scaled1u = Math.max(0, Math.min(50, scaled1u));
    const scaledTotal = scaled1u * units;

    return {
        scaled1u: parseFloat(scaled1u.toFixed(1)),
        scaledTotal: parseFloat(scaledTotal.toFixed(1)),
        percentile: Math.min(99.9, Math.max(0.1, parseFloat(percentile.toFixed(1)))),
        units: units,
        maxMark: units * 50
    };
}

/**
 * Estimate ATAR milestone equivalent if all 10 units scored at this scaled rate
 */
function estimateAtarTrajectory(scaled1u) {
    const agg10Units = scaled1u * 10;
    if (agg10Units >= ATAR_AGGREGATES_2025[0].agg) return '99.95+';
    if (agg10Units <= ATAR_AGGREGATES_2025[ATAR_AGGREGATES_2025.length - 1].agg) return '< 50.00';

    for (let i = 0; i < ATAR_AGGREGATES_2025.length - 1; i++) {
        const top = ATAR_AGGREGATES_2025[i];
        const bot = ATAR_AGGREGATES_2025[i + 1];
        if (agg10Units <= top.agg && agg10Units >= bot.agg) {
            const ratio = (agg10Units - bot.agg) / (top.agg - bot.agg);
            const estAtar = bot.atar + ratio * (top.atar - bot.atar);
            return `~${estAtar.toFixed(2)}`;
        }
    }
    return 'N/A';
}

/**
 * Main function to update the single subject scaling simulator
 */
function updateScalingSim() {
    const subjectSelect = document.getElementById('scalingSubjectSelect');
    const hscSlider = document.getElementById('scalingHscSlider');
    if (!subjectSelect || !hscSlider) return;

    const subName = subjectSelect.value;
    const subData = SCALING_DATA_2025[subName];
    if (!subData) return;

    // Adjust slider max based on 1-unit vs 2-unit
    const is1Unit = subData.units === 1;
    const currentMax = parseInt(hscSlider.max);
    const targetMax = is1Unit ? 50 : 100;

    if (currentMax !== targetMax) {
        hscSlider.max = targetMax;
        if (parseInt(hscSlider.value) > targetMax) {
            hscSlider.value = is1Unit ? 45 : 85;
        } else if (!is1Unit && parseInt(hscSlider.value) <= 50) {
            hscSlider.value = parseInt(hscSlider.value) * 2;
        }
    }

    const hscVal = parseFloat(hscSlider.value);
    document.getElementById('scalingHscVal').innerText = `${hscVal} / ${targetMax}`;

    const res = interpolateScaledMark(subData, hscVal);

    // Update Result Box
    const resScoreElem = document.getElementById('scalingResultScore');
    const resSubScoreElem = document.getElementById('scalingResultSubScore');
    const resPercentileElem = document.getElementById('scalingResultPercentile');
    const resAtarTrajectoryElem = document.getElementById('scalingAtarTrajectory');
    const resExplanationElem = document.getElementById('scalingResultExplanation');

    if (resScoreElem) resScoreElem.innerText = res.scaledTotal;
    if (resSubScoreElem) resSubScoreElem.innerText = `(${res.scaled1u} / 50 per unit)`;
    if (resPercentileElem) resPercentileElem.innerText = `Top ~${(100 - res.percentile).toFixed(1)}% of cohort (P${res.percentile})`;
    if (resAtarTrajectoryElem) resAtarTrajectoryElem.innerText = estimateAtarTrajectory(res.scaled1u);

    if (resExplanationElem) {
        const scaledCourseMean = (subData.sca.mean * subData.units).toFixed(1);
        const hscCourseMean = (subData.hsc.mean * subData.units).toFixed(1);
        resExplanationElem.innerHTML = `An HSC mark of <strong>${hscVal}/${targetMax}</strong> in <em>${subName}</em> converts to an estimated scaled mark of <strong>${res.scaledTotal}/${res.maxMark}</strong>. The 2025 cohort average scaled mark for this course was <strong>${scaledCourseMean}/${res.maxMark}</strong> (HSC mean: ${hscCourseMean}).`;
    }

    // Update Quick Subject Summary Cards
    const subMeanElem = document.getElementById('statScaledMean');
    const subCandElem = document.getElementById('statCandidature');
    const subMaxElem = document.getElementById('statMaxScaled');

    if (subMeanElem) subMeanElem.innerText = `${(subData.sca.mean * subData.units).toFixed(1)} / ${res.maxMark}`;
    if (subCandElem) subCandElem.innerText = subData.cand.toLocaleString();
    if (subMaxElem) subMaxElem.innerText = `${(subData.sca.max * subData.units).toFixed(1)} / ${res.maxMark}`;

    // Update mini comparison if active
    updateComparisonSim();
}

/**
 * Update Subject A vs Subject B comparison
 */
function updateComparisonSim() {
    const subASelect = document.getElementById('compSubA');
    const subBSelect = document.getElementById('compSubB');
    const markASlider = document.getElementById('compMarkA');
    if (!subASelect || !subBSelect || !markASlider) return;

    const subAName = subASelect.value;
    const subBName = subBSelect.value;
    const dataA = SCALING_DATA_2025[subAName];
    const dataB = SCALING_DATA_2025[subBName];
    if (!dataA || !dataB) return;

    const maxA = dataA.units * 50;
    markASlider.max = maxA;
    const markA = Math.min(maxA, parseFloat(markASlider.value));
    document.getElementById('compMarkAVal').innerText = `${markA} / ${maxA}`;

    // Calculate Scaled result for Course A
    const resA = interpolateScaledMark(dataA, markA);

    // Find equivalent HSC mark in Course B
    const targetScaled1u = resA.scaled1u;
    const maxB = dataB.units * 50;

    let equivHscB = 0;
    for (let test = 0; test <= maxB; test += 0.2) {
        const testRes = interpolateScaledMark(dataB, test);
        if (testRes.scaled1u >= targetScaled1u) {
            equivHscB = test;
            break;
        }
        equivHscB = test;
    }

    const resB = interpolateScaledMark(dataB, equivHscB);

    // Update Comparison UI
    const compAOut = document.getElementById('compResA');
    const compBOut = document.getElementById('compResB');
    const compSummary = document.getElementById('compSummaryText');

    if (compAOut) {
        compAOut.innerHTML = `
            <div class="comp-col-title">${subAName} (${dataA.units}U)</div>
            <div class="comp-score">${resA.scaledTotal} <span class="comp-sub">/ ${maxA}</span></div>
            <div class="comp-detail">HSC Mark: <strong>${markA}</strong> | 1U: <strong>${resA.scaled1u}/50</strong></div>
            <div class="comp-cohort">Cohort: Top ~${(100 - resA.percentile).toFixed(1)}% (P${resA.percentile})</div>
        `;
    }

    if (compBOut) {
        compBOut.innerHTML = `
            <div class="comp-col-title">${subBName} (${dataB.units}U)</div>
            <div class="comp-score">${resB.scaledTotal} <span class="comp-sub">/ ${maxB}</span></div>
            <div class="comp-detail">Equivalent HSC Mark: <strong style="color: var(--accent); font-size: 1.15rem;">${equivHscB.toFixed(1)} / ${maxB}</strong></div>
            <div class="comp-cohort">Cohort: Top ~${(100 - resB.percentile).toFixed(1)}% (P${resB.percentile})</div>
        `;
    }

    if (compSummary) {
        let diffNote = '';
        if ((subAName.includes('Advanced') && subBName.includes('Standard')) || (subAName.includes('Standard') && subBName.includes('Advanced'))) {
            diffNote = `<br><br>💡 <strong>Crucial English / Maths Insight:</strong> Scoring a Band 5 or 6 in <em>Standard</em> is far rarer than in <em>Advanced</em>. For example, an 80+ in English Standard places you in the <strong>top 13% (P87)</strong> of that course, whereas 65% of English Advanced students achieve 80+!`;
        }
        compSummary.innerHTML = `Scoring an HSC mark of <strong>${markA}/${maxA}</strong> in <em>${subAName}</em> places you in the top <strong>~${(100 - resA.percentile).toFixed(1)}%</strong> of that cohort, scaling to <strong>${resA.scaledTotal}/${maxA}</strong>. To achieve the exact same scaled aggregate in <em>${subBName}</em>, you would need an HSC mark of <strong>${equivHscB.toFixed(1)}/${maxB}</strong> (top <strong>~${(100 - resB.percentile).toFixed(1)}%</strong> of ${subBName}).${diffNote}`;
    }
}

/**
 * Quick Preset button handler
 */
function setScalingPreset(hscMark) {
    const slider = document.getElementById('scalingHscSlider');
    const select = document.getElementById('scalingSubjectSelect');
    if (!slider || !select) return;

    const subData = SCALING_DATA_2025[select.value];
    if (subData && subData.units === 1 && hscMark > 50) {
        slider.value = Math.round(hscMark / 2);
    } else {
        slider.value = hscMark;
    }
    updateScalingSim();
}

/**
 * Comparison Preset button helper
 */
function setComparisonPreset(subA, subB, markA) {
    const selA = document.getElementById('compSubA');
    const selB = document.getElementById('compSubB');
    const sliderA = document.getElementById('compMarkA');
    if (!selA || !selB || !sliderA) return;

    selA.value = subA;
    selB.value = subB;
    sliderA.value = markA;
    updateComparisonSim();
}

// Initialise event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const singleSelect = document.getElementById('scalingSubjectSelect');
    const compSelectA = document.getElementById('compSubA');
    const compSelectB = document.getElementById('compSubB');

    if (singleSelect) {
        singleSelect.innerHTML = '';
        Object.keys(SCALING_DATA_2025).forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.innerText = `${sub} (${SCALING_DATA_2025[sub].units}U)`;
            singleSelect.appendChild(opt);
        });
        singleSelect.value = "English Advanced";
    }

    if (compSelectA && compSelectB) {
        compSelectA.innerHTML = '';
        compSelectB.innerHTML = '';
        Object.keys(SCALING_DATA_2025).forEach(sub => {
            const optA = document.createElement('option');
            optA.value = sub;
            optA.innerText = `${sub} (${SCALING_DATA_2025[sub].units}U)`;
            compSelectA.appendChild(optA);

            const optB = document.createElement('option');
            optB.value = sub;
            optB.innerText = `${sub} (${SCALING_DATA_2025[sub].units}U)`;
            compSelectB.appendChild(optB);
        });
        compSelectA.value = "English Advanced";
        compSelectB.value = "English Standard";
    }

    updateScalingSim();
});
