if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

if (window.location.hash) {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

window.scrollTo(0, 0);

const navLinks = document.querySelectorAll('.nav a');
const sections = document.querySelectorAll('main section[id]');
const aboutTabs = document.querySelectorAll('.about-tab');
const aboutPanels = document.querySelectorAll('.about-panel');
const interactiveButtons = document.querySelectorAll('.interactive-button');
const interactiveResponse = document.getElementById('interactive-response');
const favoriteSongs = document.getElementById('favorite-songs');
const hobbyImageSection = document.getElementById('hobby-image-section');
const hobbyImage = document.getElementById('hobby-image');
const hobbyAudio = document.getElementById('hobby-audio');
const cursorCircle = document.querySelector('.cursor-circle');
const introOverlay = document.querySelector('.intro-overlay');
const startButtons = document.querySelectorAll('.intro-start');
let hasStarted = false;

const startExperience = () => {
    if (hasStarted) {
        return;
    }

    hasStarted = true;
    document.body.classList.remove('awaiting-start');

    if (introOverlay) {
            introOverlay.classList.add('is-closing');
            introOverlay.setAttribute('aria-hidden', 'true');

            window.setTimeout(() => {
                introOverlay.remove();
            }, 900);
    }
};

startButtons.forEach((startButton) => {
    startButton.addEventListener('click', startExperience);
});

if (introOverlay) {
    introOverlay.addEventListener('click', startExperience);
}

document.addEventListener('click', () => {
    if (document.body.classList.contains('awaiting-start')) {
        startExperience();
    }
}, true);

const interactiveAnswers = {
    interest: 'I enjoy exploring web design and finding creative ways to make technology feel simple and useful.',
    hobbies: 'My hobbies are playing musical instruments and listening to music. I enjoy doing these activities during my free time.',
    songs: 'Here are my Top 5 favorite songs'
};

const interestResponses = [
    interactiveAnswers.interest,
    'I like combining visual design and technology to create experiences that feel easy to use.'
];
let interestResponseIndex = 0;

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
};

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (targetId) {
            setActiveLink(targetId);
        }
    });
});

aboutTabs.forEach((button) => {
    button.addEventListener('click', () => {
        const targetId = button.dataset.target;

        aboutTabs.forEach((tab) => {
            const isSelected = tab === button;
            tab.classList.toggle('active', isSelected);
            tab.classList.toggle('btn-success', isSelected);
            tab.classList.toggle('btn-outline-success', !isSelected);
        });
        aboutPanels.forEach((panel) => {
            const isActive = panel.id === targetId;
            panel.classList.toggle('active', isActive);
            panel.style.animation = 'none';
            void panel.offsetWidth;
            panel.style.animation = isActive ? 'panelFade 0.45s ease' : 'none';
        });
    });
});

interactiveButtons.forEach((button) => {
    button.addEventListener('click', () => {
        interactiveButtons.forEach((option) => {
            option.classList.toggle('active', option === button);
        });

        if (interactiveResponse) {
            interactiveResponse.classList.remove('response-visible');
            void interactiveResponse.offsetWidth;
            interactiveResponse.textContent = interactiveAnswers[button.dataset.prompt];
            interactiveResponse.classList.toggle('response-visible', button.dataset.prompt !== 'songs');
            interactiveResponse.classList.toggle('response-interactive', button.dataset.prompt === 'interest');

            if (button.dataset.prompt === 'interest') {
                interestResponseIndex = 0;
                interactiveResponse.setAttribute('role', 'button');
                interactiveResponse.setAttribute('tabindex', '0');
                interactiveResponse.setAttribute('aria-label', 'Click to reveal another interest');
            } else {
                interactiveResponse.removeAttribute('role');
                interactiveResponse.removeAttribute('tabindex');
                interactiveResponse.removeAttribute('aria-label');
            }
        }

        if (favoriteSongs) {
            favoriteSongs.hidden = button.dataset.prompt !== 'songs';
        }

                if (hobbyImageSection) {
            hobbyImageSection.hidden = button.dataset.prompt !== 'hobbies';
        }
    });
});

const revealNextInterest = () => {
    if (!interactiveResponse?.classList.contains('response-interactive')) {
        return;
    }

    interestResponseIndex = (interestResponseIndex + 1) % interestResponses.length;
    interactiveResponse.classList.remove('response-visible');
    void interactiveResponse.offsetWidth;
    interactiveResponse.textContent = interestResponses[interestResponseIndex];
    interactiveResponse.classList.add('response-visible');
};

if (interactiveResponse) {
    interactiveResponse.addEventListener('click', revealNextInterest);
    interactiveResponse.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            revealNextInterest();
        }
    });
}

if (hobbyImage && hobbyAudio) {
    hobbyImage.addEventListener('click', () => {
        hobbyAudio.currentTime = 0;
        hobbyAudio.play();
    });
}

const profileImage = document.querySelector('.profile');

if (cursorCircle) {
    window.addEventListener('pointermove', (event) => {
        cursorCircle.style.left = `${event.clientX}px`;
        cursorCircle.style.top = `${event.clientY}px`;
    });

    const hoverTargets = document.querySelectorAll('a, button, .song-card, audio, .profile, .about-detail, .skill-detail');
    hoverTargets.forEach((element) => {
        element.addEventListener('mouseenter', () => cursorCircle.classList.add('cursor-hover'));
        element.addEventListener('mouseleave', () => cursorCircle.classList.remove('cursor-hover'));
    });

    window.addEventListener('pointerdown', () => cursorCircle.classList.add('cursor-click'));
    window.addEventListener('pointerup', () => cursorCircle.classList.remove('cursor-click'));
}

if (profileImage) {
    profileImage.addEventListener('pointermove', (event) => {
        const rect = profileImage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 28;
        const rotateX = (0.5 - y) * 22;

        profileImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });

    profileImage.addEventListener('pointerleave', () => {
        profileImage.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
}

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    },
    {
        threshold: 0.18
    }
);

sections.forEach((section) => {
    revealObserver.observe(section);
});

const navObserver = new IntersectionObserver(
    (entries) => {
        const visibleEntry = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
            setActiveLink(visibleEntry.target.id);
        }
    },
    {
        root: null,
        rootMargin: '-30% 0px -45% 0px',
        threshold: [0.2, 0.4, 0.8]
    }
);

sections.forEach((section) => navObserver.observe(section));

const firstSection = document.querySelector('main section[id]');
if (firstSection) {
    setActiveLink(firstSection.id);
    firstSection.classList.add('visible');
}
