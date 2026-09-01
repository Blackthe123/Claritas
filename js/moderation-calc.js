/* ============================================================
   js/moderation-calc.js — HSC Moderation interactive calculator
   Used in: blog/hsc-moderation-explained.html
   ============================================================ */

'use strict';

function updateModerationTable() {
    const students = [
        {
            name: 'Alice',
            internal: parseFloat(document.getElementById('aliceInternal').value) || 0,
            exam: parseFloat(document.getElementById('aliceExam').value) || 0,
            avatarClass: 'avatar-alice',
            avatarLetter: 'A'
        },
        {
            name: 'Bob',
            internal: parseFloat(document.getElementById('bobInternal').value) || 0,
            exam: parseFloat(document.getElementById('bobExam').value) || 0,
            avatarClass: 'avatar-bob',
            avatarLetter: 'B'
        },
        {
            name: 'Charlie',
            internal: parseFloat(document.getElementById('charlieInternal').value) || 0,
            exam: parseFloat(document.getElementById('charlieExam').value) || 0,
            avatarClass: 'avatar-charlie',
            avatarLetter: 'C'
        }
    ];

    // Step 1: Calculate Internal Ranks (Sort descending by internal mark)
    const sortedByInternal = [...students].sort((a, b) => b.internal - a.internal);
    sortedByInternal.forEach((st, idx) => { st.rank = idx + 1; });

    // Step 2: Sort HSC Exam Marks descending
    const sortedExamMarks = students.map(s => s.exam).sort((a, b) => b - a);

    // Step 3: Assign Moderated Assessment Mark based on Internal Rank
    students.forEach(st => {
        st.assessmentMark = sortedExamMarks[st.rank - 1];
        let finalHsc = ((st.assessmentMark + st.exam) / 2).toFixed(1);
        if (finalHsc.endsWith('.0')) finalHsc = Math.round(finalHsc).toString();
        st.finalHscMark = finalHsc;
    });

    // Step 4: Render Table Rows
    const tbody = document.getElementById('moderationTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    students.forEach(st => {
        const tr = document.createElement('tr');
        const rankClass = st.rank === 1 ? 'rank-1' : (st.rank === 2 ? 'rank-2' : 'rank-3');
        const rankSuffix = st.rank === 1 ? 'st' : (st.rank === 2 ? 'nd' : 'rd');

        tr.innerHTML = `
            <td>
                <div style="display:flex; align-items:center; gap:0.6rem;">
                    <div class="student-avatar ${st.avatarClass}">${st.avatarLetter}</div>
                    <strong>${st.name}</strong>
                </div>
            </td>
            <td>${st.internal}</td>
            <td><span class="rank-badge ${rankClass}">${st.rank}${rankSuffix}</span></td>
            <td class="highlight-col">${st.assessmentMark}</td>
            <td>${st.exam}</td>
            <td class="final-mark-col">${st.finalHscMark}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', updateModerationTable);
