// Global variables
let currentSlide = 0;
let slides = document.querySelectorAll('.slide');
let indicators = document.querySelectorAll('.indicator');
let totalSlides = 0;
let slideInterval = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get fresh references to slides and indicators
    slides = document.querySelectorAll('.slide');
    indicators = document.querySelectorAll('.indicator');
    totalSlides = slides.length;
    
    if (totalSlides === 0) {
        console.warn('No slides found. Check your HTML.');
        return;
    }
    
    // Initialize first slide
    showSlide(0);
    
    // Start auto-slide
    startAutoSlide();
    
    // Setup all event listeners
    setupEventListeners();
});

// Slide functions - SINGLE DEFINITION ONLY
function showSlide(index) {
    if (index >= totalSlides || index < 0 || totalSlides === 0) return;
    
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Remove active class from all indicators (if they exist)
    if (indicators.length > 0) {
        indicators.forEach(indicator => indicator.classList.remove('active'));
    }
    
    // Add active class to current slide and indicator
    slides[index].classList.add('active');
    if (indicators[index]) {
        indicators[index].classList.add('active');
    }
    
    currentSlide = index;
}

function changeSlide(direction) {
    // Clear existing interval to prevent conflicts
    clearAutoSlide();
    
    if (direction === 1) {
        currentSlide = (currentSlide + 1) % totalSlides;
    } else if (direction === -1) {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    }
    
    showSlide(currentSlide);
    
    // Restart auto-slide after manual navigation
    startAutoSlide();
}

function goToSlide(index) {
    if (index >= totalSlides || index < 0) return;
    
    clearAutoSlide();
    showSlide(index);
    startAutoSlide();
}

// Auto-slide management
function startAutoSlide() {
    clearAutoSlide(); // Clear any existing interval first
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }, 6000);
}

function clearAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Mobile menu toggle
function toggleMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    
    if (!mobileMenu) {
        console.error('Mobile menu element not found');
        return;
    }
    
    // Use consistent class names
    mobileMenu.classList.toggle('active');
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
    
    document.body.classList.toggle('no-scroll');
}

// Setup all event listeners - called once on DOM load
function setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Close mobile menu when clicking on links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
    
    // Touch/swipe functionality for mobile
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        setupTouchEvents(heroSection);
        
        // Pause auto-slide on hover
        heroSection.addEventListener('mouseenter', clearAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Fade-in animation observer
    setupFadeInAnimation();
    
    // Modal functionality
    setupModalEvents();
    
    // Loading animation
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// Event handlers
function handleScroll() {
    const header = document.getElementById('header');
    const scrolled = window.pageYOffset;
    
    // Header effect
    if (header) {
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Parallax effect for hero section
    const parallaxElements = document.querySelectorAll('.slide');
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

function handleKeydown(e) {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
    } else if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
}

// Touch events setup
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

function setupTouchEvents(element) {
    element.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    element.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(touchStartY - touchEndY);
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(diffX) > swipeThreshold && Math.abs(diffX) > diffY) {
        if (diffX > 0) {
            changeSlide(1);
        } else {
            changeSlide(-1);
        }
    }
}

// Smooth scrolling setup
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fade-in animation setup
function setupFadeInAnimation() {
    const faders = document.querySelectorAll('.fade-in');
    
    if (faders.length === 0) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    faders.forEach(el => {
        observer.observe(el);
    });
}

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const bookingModal = document.getElementById('bookingModal');
    const closeButton = document.querySelector('.close-button');
    const bookNowTriggers = document.querySelectorAll('.book-now-trigger');
    const packageNameSpan = document.getElementById('packageName');

    // Open modal when Book Now is clicked
    bookNowTriggers.forEach(button => {
        button.addEventListener('click', function() {
            const packageName = this.getAttribute('data-package-name');
            if (packageNameSpan) {
                packageNameSpan.textContent = packageName;
            }
            if (bookingModal) {
                bookingModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal when X button is clicked
    if (closeButton && bookingModal) {
        closeButton.addEventListener('click', function() {
            bookingModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bookingModal) {
            bookingModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && bookingModal.classList.contains('show')) {
            bookingModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Fade in animation
    const observeElements = () => {
        const elements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(element => {
            observer.observe(element);
        });
    };

    observeElements();
});

document.addEventListener('DOMContentLoaded', function() {
   const contactForm = document.querySelector('.contact-form form');
   const submitButton = contactForm.querySelector('button[type="submit"]');
   const originalButtonText = submitButton.textContent;
   
   // WhatsApp number
   const whatsappNumber = '6282110821485';
   
   contactForm.addEventListener('submit', function(e) {
       e.preventDefault();
       
       // Get form values
       const name = contactForm.querySelector('input[type="text"]').value.trim();
       const email = contactForm.querySelector('input[type="email"]').value.trim();
       const phone = contactForm.querySelector('input[type="tel"]').value.trim();
       const packageSelect = contactForm.querySelector('select');
       const selectedPackage = packageSelect.options[packageSelect.selectedIndex].text;
       const message = contactForm.querySelector('textarea').value.trim();
       
       // Validation
       if (!name || !email || !phone || !packageSelect.value || !message) {
           alert('Please fill in all fields');
           return;
       }
       
       // Email validation
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       if (!emailRegex.test(email)) {
           alert('Please enter a valid email address');
           return;
       }
       
       // Show loading
       submitButton.textContent = 'Sending...';
       submitButton.disabled = true;
       
       // Create WhatsApp message
       const whatsappMessage = `🌟 *New Contact Form Inquiry* 🌟

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Phone:* ${phone}
🎯 *Package:* ${selectedPackage}

💬 *Message:*
${message}

---
Sent from Indonesia Explorer Website`;
       
       // Open WhatsApp
       const encodedMessage = encodeURIComponent(whatsappMessage);
       const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
       
       setTimeout(() => {
           window.open(whatsappUrl, '_blank');
           
           // Reset form
           contactForm.reset();
           submitButton.textContent = originalButtonText;
           submitButton.disabled = false;
           
           alert('Message sent! We will contact you soon.');
       }, 1000);
   });
});

 document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function() {
                const video = this.parentElement.querySelector('video');
                if (video.paused) {
                    video.play();
                    this.style.display = 'none';
                } else {
                    video.pause();
                    this.style.display = 'flex';
                }
            });
        });

        // Show play button when video ends
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('ended', function() {
                const playButton = this.parentElement.querySelector('.play-button');
                playButton.style.display = 'flex';
            });
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all gallery items
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease-out';
            observer.observe(item);
        });

         document.querySelectorAll('.video-item').forEach(item => {
            const video = item.querySelector('video');
            const playOverlay = item.querySelector('.play-overlay');
            
            playOverlay.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playOverlay.style.opacity = '0';
                } else {
                    video.pause();
                    playOverlay.style.opacity = '1';
                }
            });
            
            video.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playOverlay.style.opacity = '0';
                } else {
                    video.pause();
                    playOverlay.style.opacity = '1';
                }
            });
            
            video.addEventListener('ended', () => {
                playOverlay.style.opacity = '1';
            });
        });

        // Hover effects for videos
        document.querySelectorAll('.video-item').forEach(item => {
            const video = item.querySelector('video');
            
            item.addEventListener('mouseenter', () => {
                if (video.paused) {
                    video.currentTime = 0;
                    video.play();
                    setTimeout(() => {
                        if (video.paused === false) {
                            video.pause();
                        }
                    }, 2000);
                }
            });
        });