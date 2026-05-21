// Travel Agency - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.add('active');
            const icon = this.querySelector('i');
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        });
    }
    
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function() {
            navLinks.classList.remove('active');
            const menuIcon = mobileMenuBtn.querySelector('i');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        });
    }
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) {
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Blur Fade Animation with Intersection Observer
    const blurFadeElements = document.querySelectorAll('.blur-fade');
    
    const blurFadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, delay * 1000);
                blurFadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    blurFadeElements.forEach(el => blurFadeObserver.observe(el));

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Animate stats on scroll
    const stats = document.querySelectorAll('.stat-item h3');
    let animated = false;
    
    function animateStats() {
        if (animated) return;
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            const suffix = stat.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 30);
        });
        animated = true;
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stats-bar')) {
                    animateStats();
                }
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.package-card, .stats-bar').forEach(el => {
        observer.observe(el);
    });
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    .package-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .package-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Package Filter Functionality
const packageFilter = {
    init() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const packageCards = document.querySelectorAll('.package-card');
        
        if (filterButtons.length === 0 || packageCards.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button styling
                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline');
                    btn.style.color = 'var(--text-dark)';
                    btn.style.borderColor = '#e5e7eb';
                });
                
                this.classList.remove('btn-outline');
                this.classList.add('btn-primary');
                this.style.color = '';
                this.style.borderColor = '';
                
                // Filter packages and section headings
                const packageGrids = document.querySelectorAll('.packages-grid');
                
                if (filter === 'all') {
                    // Show all sections and headings
                    packageGrids.forEach(grid => {
                        const section = grid.closest('section');
                        const heading = section.querySelector('.section-title');
                        if (heading) heading.style.display = 'block';
                        section.style.display = 'block';
                    });
                    
                    packageCards.forEach(card => {
                        card.style.display = 'block';
                        // Add fade-in animation
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    });
                } else {
                    // Filter packages and manage section headings
                    packageGrids.forEach(grid => {
                        const section = grid.closest('section');
                        const heading = section.querySelector('.section-title');
                        const visibleCards = grid.querySelectorAll('.package-card');
                        let hasVisibleCards = false;
                        
                        // Check if this section has cards matching the filter
                        visibleCards.forEach(card => {
                            const category = card.getAttribute('data-category');
                            if (category === filter) {
                                hasVisibleCards = true;
                            }
                        });
                        
                        if (hasVisibleCards) {
                            // Show section and its heading
                            section.style.display = 'block';
                            if (heading) heading.style.display = 'block';
                        } else {
                            // Hide section completely
                            section.style.display = 'none';
                        }
                    });
                    
                    packageCards.forEach(card => {
                        const category = card.getAttribute('data-category');
                        
                        if (category === filter) {
                            card.style.display = 'block';
                            // Add fade-in animation
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
};

// Initialize testimonial cards and scroll animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Reveal testimonial cards on scroll
    const testimonialCards = document.querySelectorAll('.stacked-card');
    testimonialCards.forEach((card, index) => {
        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    testimonialObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        testimonialObserver.observe(card);
    });

    // Reveal destination cards on scroll (same pattern as testimonials)
    const destinationCards = document.querySelectorAll('.destination-card.fade-in');
    destinationCards.forEach((card, index) => {
        const destinationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    destinationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        destinationObserver.observe(card);
    });
    
    // Initialize package filter
    packageFilter.init();
});
