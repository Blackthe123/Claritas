/* ============================================================
   js/tutors.js — Tutor profile modal popup
   ============================================================ */

'use strict';

const tutorData = {
    tutor1: {
        image: 'images/banner.png',
        name: 'Ayush Yajaman',
        subjects: ['Math Advanced', 'Math Extension 1', 'Math Extension 2', 'Physics', 'Chemistry', 'Software Engineering'],
        bio: 'Ayush Yajaman brings over 4 years of teaching experience and an impressive 99.30 ATAR. He is currently pursuing a Bachelor of Computer Science at UNSW and wants to be a pioneer in building cutting-edge AI solutions.',
        approach: 'I believe mathematics is a language that describes our world and science enables us to understand it. My approach focuses on building deep conceptual understanding rather than rote memorisation, helping students see the beauty and logic in mathematical and scientific thinking. Through structured problem-solving and personalised guidance, I help students develop confidence and genuine understanding.',
        credentials: [
            '99.30 ATAR',
            '4+ years chess tutoring experience',
            'Published AI research in IJHSR journal',
            'Arthur Phillip High School Dux',
            'B Advanced Computer Science (Honours), UNSW'
        ],
        meeting: "https://cal.com/ayush-yajaman-bf5qw6"
    },
    tutor2: {
        image: 'images/banner.png',
        name: 'Ned Reside',
        subjects: ['English Standard', 'English Advanced', 'Ancient History', 'Modern History', 'Legal Studies'],
        bio: 'Ned Reside is an experienced tutor, teaching his HSC peers the social sciences while simultaneously achieving a reverent 97 ATAR. He is undertaking a bachelor of politics, philosophy and economics at the University of Sydney and is pursuing a career as a world leader, embedded in Australia\'s legislative and judicial system.',
        approach: 'My academic success has been bolstered by my love for learning, education and growth. A drive which I aim to share amongst my students, empowering the future generation. I aim to boost both the content knowledge and writing ability necessary for improvement through a teaching methodology that focuses on study practices, guidance through difficult content and targeted feedback on written work. By combining structured study strategies with personalized support, I ensure that students not only grasp the material but also develop the critical thinking and communication skills needed to excel academically and beyond.',
        credentials: [
            '97 ATAR',
            'Band 6s in all 6 subjects',
            'Tutored year 11 and 12 students throughout final year of highschool',
            'Published in the notable academic journal Overland',
            'B Politics, Philosophy and Economics'
        ],
        meeting: "https://cal.com/nedreside"
    },
    tutor3: {
        image: 'images/banner.png',
        name: 'Tarun Vakkalagadda',
        subjects: ['Math Extension 2', 'Math Extension 1', 'Chemistry'],
        bio: 'Tarun Vakkalagadda has 1 year of private tutoring experience and achieved an impressive 99.05 ATAR. He is currently pursuing a double degree in Actuarial Studies and Computer Science at UNSW and aims to innovate in risk management and data-driven financial solutions.',
        approach: 'Mastering the HSC shouldn\'t be a struggle of memorising, but a process of building logical intuition. I specialise in breaking down complex Maths and Chemistry concepts into manageable chunks, replacing rote learning with deep conceptual understanding. By training students to be active problem-solvers rather than passive listeners, I ensure they have the confidence to apply their knowledge to unfamiliar contexts and the most challenging exam questions.',
        credentials: [
            '99.05 ATAR',
            '1 Year of tutoring experience',
            'Frank Doyle Shield for Excellence in Economics',
            'Band 6s in 4U Maths, Chemistry and Physics',
            'B Computer Science and B Actuarial Studies, UNSW'
        ],
        meeting: "https://cal.com/tarun-vakkalagadda"
    },
    tutor4: {
        image: 'images/banner.png',
        name: 'Aditya Shivakumar',
        subjects: ['Math Advanced', 'Math Standard', 'Biology', 'Business Studies'],
        bio: 'Aditya Shivakumar achieved an outstanding 98.35 ATAR and has over a year of tutoring experience, including 1 year of private tutoring and 4 months of institutional teaching. He is currently studying a Bachelor of Commerce and a Bachelor of Information Systems at UNSW, with a strong interest in business, technology, and data-driven innovation.',
        approach: 'Excelling in the HSC requires more than understanding content, it requires knowing how to study effectively. In Mathematics Standard/Advanced, Biology and Business Studies, I break complex topics into clear, structured frameworks that make concepts easier to grasp and apply in exams. Beyond content, I also teach proven study techniques that improve retention, recall and exam performance. My goal is to equip students not just with knowledge, but with the systems and confidence to consistently perform at a high level.',
        credentials: [
            '98.35 ATAR',
            '1+ year tutoring experience',
            'Band 6 in Maths, Biology and Business Studies',
            'B Commerce + B Information Systems, UNSW'
        ],
        meeting: "https://cal.com/aditya.s1501"
    }
};

function openModal(tutorId) {
    const tutor = tutorData[tutorId];
    if (!tutor) return;
    const modal = document.getElementById('tutorModal');
    const modalImage = document.getElementById('modalImage');
    const modalBody = document.getElementById('modalBody');

    modalImage.src = tutor.image;
    modalImage.alt = tutor.name || 'Tutor photo';

    modalBody.innerHTML = `
        <h2 class="modal-tutor-name">${tutor.name}</h2>
        <div class="modal-tutor-subjects">
            ${tutor.subjects.map(subject => `<span class="modal-subject-tag">${subject}</span>`).join('')}
        </div>
        <h3 class="section-heading">About</h3>
        <p class="modal-text">${tutor.bio}</p>
        <h3 class="section-heading">Teaching Approach</h3>
        <p class="modal-text">${tutor.approach}</p>
        <h3 class="section-heading">Credentials &amp; Expertise</h3>
        <ul class="credentials-list">
            ${tutor.credentials.map(cred => `<li>${cred}</li>`).join('')}
        </ul>
        <a href="${tutor.meeting}" class="book-session-btn" target="_blank" rel="noopener noreferrer">Book Free Session with ${tutor.name.split(' ')[0]}</a>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('tutorModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function closeModalOnOutside(event) {
    if (event.target.id === 'tutorModal') {
        closeModal();
    }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Auto-open modal from URL hash (e.g. tutors.html#tutor1)
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && tutorData[hash]) {
        setTimeout(() => openModal(hash), 300);
    }
});
