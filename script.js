// ============================================
// INFINITE GALLERY LOOP SETUP
// ============================================

function setupGalleryLoop() {
    const galleryTracks = document.querySelectorAll('.gallery-track');

    galleryTracks.forEach(track => {
        // Get all original items
        const items = Array.from(track.querySelectorAll('.gallery-item'));

        // Clone all original items and append them
        items.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });

        console.log(`✨ Gallery track cloned: ${items.length} items duplicated`);
    });
}

// Run on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    setupGalleryLoop();
});

// ============================================
// SCROLL LOCK STATE
// ============================================

let hasEnteredExperience = false;

/**
 * Lock scrolling on page load
 */
function lockScroll() {
    document.body.classList.add('scroll-locked');
    document.body.style.overflow = 'hidden';
}

/**
 * Unlock scrolling permanently after CTA click
 */
function unlockScroll() {
    if (hasEnteredExperience) return; // Only unlock once
    hasEnteredExperience = true;
    document.body.classList.remove('scroll-locked');
    document.body.style.overflow = 'auto';
}

// Lock scroll on initial page load
window.addEventListener('load', () => {
    lockScroll();
});

// ============================================
// CUSTOM SLOW SCROLL ANIMATION
// ============================================

function smoothScrollTo(element, duration = 4000) {
    const startPosition = window.scrollY;
    const targetPosition = element.offsetTop;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * ease);

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// ============================================
// CTA BUTTON & AUDIO INTERACTION
// ============================================

const playButton = document.getElementById('playButton');
const backgroundMusic = document.getElementById('backgroundMusic');
const gallerySection = document.getElementById('gallery');

playButton.addEventListener('click', () => {
    // Prevent multiple clicks
    playButton.disabled = true;

    // Start playing music
    backgroundMusic.currentTime = 0;
    backgroundMusic.play().catch(error => {
        console.log('Audio playback failed:', error);
    });

    // Wait 800-1200ms (using 1000ms as middle ground)
    setTimeout(() => {
        // Unlock scrolling
        unlockScroll();

        // Very slow smooth scroll to gallery (4 seconds)
        smoothScrollTo(gallerySection, 4000);

        // Re-enable button after scroll
        playButton.disabled = false;
    }, 1000);
});

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        } else {
            // Remove class to allow reversible animations
            entry.target.classList.remove('in-view');
        }
    });
}, observerOptions);

// ============================================
// OBSERVE ELEMENTS FOR SCROLL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        observer.observe(item);
    });

    // Observe message section elements
    const birthdayTitle = document.querySelector('.birthday-title');
    const birthdayMessage = document.querySelector('.birthday-message');
    const signature = document.querySelector('.signature');

    if (birthdayTitle) observer.observe(birthdayTitle);
    if (birthdayMessage) observer.observe(birthdayMessage);
    if (signature) observer.observe(signature);
});

// ============================================
// PREVENT SCROLLING INTERACTIONS
// ============================================

// Prevent mouse wheel scrolling when locked
document.addEventListener('wheel', (e) => {
    if (hasEnteredExperience === false) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent touchpad scrolling when locked
document.addEventListener('touchmove', (e) => {
    if (hasEnteredExperience === false) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent keyboard scrolling when locked
document.addEventListener('keydown', (e) => {
    if (hasEnteredExperience === false) {
        // Prevent arrow keys, Page Up/Down, Home, End, Space
        if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
            e.preventDefault();
        }
    }
}, { passive: false });

// ============================================
// PAUSE MUSIC ON PAGE LEAVE
// ============================================

window.addEventListener('beforeunload', () => {
    backgroundMusic.pause();
});

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        backgroundMusic.pause();
    }
});

// ============================================
// SMOOTH SCROLL ENHANCEMENT
// ============================================

document.documentElement.style.scrollBehavior = 'smooth';

console.log('✨ Birthday website loaded and scroll locked. Click the button to begin!');
