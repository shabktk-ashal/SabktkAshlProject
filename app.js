document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. INTRO LOADER FADE OUT
    // ==========================================
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 800);
        });
        
        // Backup timeout in case load event takes too long
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 3000);
    }

    // ==========================================
    // 2. MOBILE MENU TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                navMenu.classList.remove('open');
            });
        });
    }

    // ==========================================
    // 3. SCROLL COORDINATOR, ACTIVE SECTIONS & PROGRESS INDICATORS
    // ==========================================
    const header = document.querySelector('.header');
    const stickyBar = document.getElementById('sticky-bar');
    const hero = document.getElementById('hero');
    const sections = document.querySelectorAll('section[id], footer[id]');
    // navLinks is already declared in Mobile Menu Toggle section above
    const progressDots = document.querySelectorAll('.progress-dot-wrapper');

    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // Update horizontal progress bar (Option A)
        const progressBar = document.getElementById('scroll-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Update vertical side progress (Option B)
        const verticalFill = document.getElementById('vertical-progress-fill');
        if (verticalFill) {
            verticalFill.style.height = `${scrollPercent}%`;
        }
    };

    const updateActiveSection = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Trigger threshold offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Top of page edge case
        if (window.scrollY < 100) {
            currentSectionId = 'hero';
        }
        
        // Bottom of page edge case
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50) {
            currentSectionId = 'contact';
        }

        if (currentSectionId) {
            // Highlight navbar menu item
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });

            // Highlight corresponding side dot
            progressDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-section') === currentSectionId) {
                    dot.classList.add('active');
                }
            });
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show sticky bottom bar ONLY after scrolling past Hero section
        if (stickyBar && hero) {
            if (window.scrollY > hero.offsetHeight - 80) {
                stickyBar.classList.add('visible');
            } else {
                stickyBar.classList.remove('visible');
            }
        }

        updateScrollProgress();
        updateActiveSection();
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==========================================
    // 4. INFINITE REVIEW MARQUEE CLONE
    // ==========================================
    const marqueeTrack = document.getElementById('marquee-track');
    if (marqueeTrack) {
        const clone = marqueeTrack.innerHTML;
        marqueeTrack.innerHTML += clone; // Double content for seamless looping scroll
    }

    // ==========================================
    // 5. TABS SWITCHER WITH SLIDING INDICATOR
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const packagesGrid = document.getElementById('packages-grid');
    const indicator = document.getElementById('tab-indicator');

    const updateIndicator = (activeBtn) => {
        if (!indicator || !activeBtn) return;
        const btnRect = activeBtn.getBoundingClientRect();
        const containerRect = activeBtn.parentElement.getBoundingClientRect();
        const leftOffset = btnRect.left - containerRect.left;
        
        indicator.style.width = `${btnRect.width}px`;
        indicator.style.transform = `translateX(${leftOffset}px)`;
        
        const provider = activeBtn.dataset.provider;
        indicator.className = 'tab-indicator';
        indicator.classList.add(provider);
    };

    if (tabBtns.length > 0 && packagesGrid) {
        const defaultActive = document.querySelector('.tab-btn.active');
        setTimeout(() => updateIndicator(defaultActive), 200);

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                updateIndicator(btn);
                
                const provider = btn.dataset.provider;
                
                // Clear the active class from all package cards so they can trigger stagger animations again when shown
                document.querySelectorAll('.package-card').forEach(card => card.classList.remove('active'));
                
                packagesGrid.className = 'packages-grid';
                packagesGrid.classList.add(`${provider}-active`);
                
                setTimeout(revealScan, 50);
            });
        });

        window.addEventListener('resize', () => {
            const activeBtn = document.querySelector('.tab-btn.active');
            updateIndicator(activeBtn);
        });
    }

    // ==========================================
    // 6. WHATSAPP CHECKOUT LINKS & FORMATS
    // ==========================================
    const whatsappNumber = "201066755786";
    const pkgBtns = document.querySelectorAll('.whatsapp-pkg-btn');

    pkgBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pkgName = btn.dataset.package; // E.g., "WE Gold 50GB Package"
            
            // Format strictly containing: "Hello, I'm interested in the [Package Name]."
            const prefilledText = `Hello, I'm interested in the ${pkgName}.`;
            const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledText)}`;
            
            window.open(waUrl, '_blank');
        });
    });

    // ==========================================
    // 7. SMART PACKAGE FINDER RECOMMENDATIONS
    // ==========================================
    const finderOptBtns = document.querySelectorAll('.finder-opt-btn');
    const finderResult = document.getElementById('finder-result');
    const finderProvider = document.getElementById('finder-provider');
    const finderTitle = document.getElementById('finder-title');
    const finderPrice = document.getElementById('finder-price');
    const finderCta = document.getElementById('finder-cta');

    // Packages Mapping for Finder
    const finderDatabase = {
        light: {
            provider: 'we',
            providerText: 'WE GOLD',
            title: 'WE Gold 10GB Package',
            price: '170 EGP'
        },
        medium: {
            provider: 'we',
            providerText: 'WE GOLD',
            title: 'WE Gold 30GB Package',
            price: '330 EGP'
        },
        heavy: {
            provider: 'etisalat',
            providerText: 'ETISALAT',
            title: 'Etisalat 100GB Package',
            price: '1050 EGP'
        }
    };

    finderOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Reset active state
            finderOptBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tier = btn.dataset.tier;
            const data = finderDatabase[tier];

            if (data && finderResult) {
                // Animate result change
                finderResult.classList.remove('active');
                
                setTimeout(() => {
                    finderProvider.textContent = data.providerText;
                    finderProvider.className = `finder-result-provider ${data.provider}`;
                    finderTitle.textContent = data.title;
                    finderPrice.textContent = data.price;
                    
                    finderResult.classList.add('active');
                }, 150);
            }
        });
    });

    if (finderCta) {
        finderCta.addEventListener('click', () => {
            const activeOpt = document.querySelector('.finder-opt-btn.active');
            const tier = activeOpt ? activeOpt.dataset.tier : 'medium';
            const data = finderDatabase[tier];
            
            if (data) {
                const prefilledText = `Hello, I'm interested in the recommended ${data.title}.`;
                const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledText)}`;
                window.open(waUrl, '_blank');
            }
        });
    }

    // ==========================================
    // 8. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealScan = () => {
        // Reveal section elements
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 80) {
                el.classList.add('active');
            }
        });
        // Reveal package cards (only visible ones)
        const visibleCards = Array.from(document.querySelectorAll('.package-card')).filter(card => card.offsetParent !== null);
        visibleCards.forEach((card, i) => {
            const top = card.getBoundingClientRect().top;
            if (top < window.innerHeight - 60) {
                setTimeout(() => card.classList.add('active'), i * 60);
            }
        });
    };

    window.addEventListener('scroll', revealScan);
    revealScan();

    // ==========================================
    // 9. STATISTICS COUNTER
    // ==========================================
    const statsSection = document.getElementById('stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target, 10);
            const duration = 2000;
            const startTime = performance.now();

            const updateCount = (timestamp) => {
                const elapsed = timestamp - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = progress * (2 - progress);
                const currentVal = Math.floor(easeProgress * target);

                if (target >= 1000) {
                    stat.textContent = currentVal.toLocaleString() + '+';
                } else if (target === 99 || target === 100) {
                    stat.textContent = currentVal + '%';
                } else {
                    stat.textContent = currentVal + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    if (target >= 1000) {
                        stat.textContent = target.toLocaleString() + '+';
                    } else if (target === 99 || target === 100) {
                        stat.textContent = target + '%';
                    } else {
                        stat.textContent = target + '+';
                    }
                }
            };

            requestAnimationFrame(updateCount);
        });
    };

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    startCounters();
                    observer.unobserve(statsSection);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    }

    // ==========================================
    // 10. FAQ ACCORDIONS
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const headerBtn = item.querySelector('.faq-header');
        const content = item.querySelector('.faq-content');

        headerBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // ==========================================
    // 11. HTML5 CANVAS NET PARTICLES
    // ==========================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const particlesCount = 50;
    const connectDistance = 110;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.alpha = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${this.alpha})`;
            ctx.fill();
        }
    }

    const initParticles = () => {
        particlesArray = [];
        for (let i = 0; i < particlesCount; i++) {
            particlesArray.push(new Particle());
        }
    };

    // Draw lines connecting close particles (SaaS grid look)
    const connectParticles = () => {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectDistance) {
                    const opacity = (1 - (distance / connectDistance)) * 0.12;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();
});
