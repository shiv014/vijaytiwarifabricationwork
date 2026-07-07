document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. GLOBAL VARIABLES & STATE
       ========================================== */
    let currentImageIndex = 0;
    let imagesLoadedCount = 0;
    const imagesPerPage = 12;
    const totalImages = typeof galleryImages !== 'undefined' ? galleryImages : [];
    
    // DOM Elements
    const mainHeader = document.getElementById('header');
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    
    // Gallery Elements
    const galleryGrid = document.getElementById('galleryGrid');
    const btnLoadMore = document.getElementById('btnLoadMore');
    
    // Lightbox Elements
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    // Contact Form Elements
    const contactForm = document.getElementById('contactForm');
    const btnSubmitForm = document.getElementById('btnSubmitForm');
    const formSpinner = document.getElementById('formSpinner');
    const toastContainer = document.getElementById('toastContainer');


    /* ==========================================
       2. SCROLL ACTIONS (HEADER & BACK-TO-TOP)
       ========================================== */
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        
        // Header shrink on scroll
        if (scrollPos > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
        
        // Back to top button visibility
        if (scrollPos > 500) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
        
        // ScrollSpy (Active nav highlighting)
        spyScroll();
    });

    function spyScroll() {
        const scrollPosition = window.scrollY + 200; // Offset for header
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            if (section.id) {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${section.id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    }


    /* ==========================================
       3. MOBILE NAVIGATION MENU
       ========================================== */
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    /* ==========================================
       4. DYNAMIC PORTFOLIO / GALLERY
       ========================================== */
    function renderGalleryPage() {
        if (!galleryGrid || totalImages.length === 0) return;
        
        const startIndex = imagesLoadedCount;
        const endIndex = Math.min(startIndex + imagesPerPage, totalImages.length);
        
        for (let i = startIndex; i < endIndex; i++) {
            const imgData = totalImages[i];
            
            // Create gallery item
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.dataset.index = i;
            
            // Lazy load images
            galleryItem.innerHTML = `
                <img src="${imgData.src}" alt="${imgData.title}" loading="lazy">
                <div class="gallery-overlay">
                    <span>Vijay Tiwari Work</span>
                    <h4>Project Work #${imgData.id}</h4>
                </div>
            `;
            
            // Click to open lightbox
            galleryItem.addEventListener('click', () => {
                openLightbox(i);
            });
            
            galleryGrid.appendChild(galleryItem);
        }
        
        imagesLoadedCount = endIndex;
        
        // Hide load more button if all images are loaded
        if (imagesLoadedCount >= totalImages.length) {
            if (btnLoadMore) {
                btnLoadMore.style.display = 'none';
            }
        }
    }

    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', () => {
            renderGalleryPage();
        });
    }

    // Initialize first load
    renderGalleryPage();


    /* ==========================================
       5. GALLERY LIGHTBOX MODAL
       ========================================== */
    function openLightbox(index) {
        currentImageIndex = index;
        const imgData = totalImages[currentImageIndex];
        
        if (!imgData) return;
        
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.title;
        lightboxCaption.textContent = `Vijay Tiwari Fabrication & Erection - Photo #${imgData.id}`;
        
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop page scroll
    }

    function closeLightbox() {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Re-enable scroll
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages.length;
        updateLightboxContent();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages.length) % totalImages.length;
        updateLightboxContent();
    }

    function updateLightboxContent() {
        const imgData = totalImages[currentImageIndex];
        if (!imgData) return;
        
        // Add fade transition effect
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = imgData.src;
            lightboxImg.alt = imgData.title;
            lightboxCaption.textContent = `Vijay Tiwari Fabrication & Erection - Photo #${imgData.id}`;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    // Lightbox Event Listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    
    // Close on backdrop click
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });


    /* ==========================================
       6. INTERACTION & TEXT COUNT ANIMATION
       ========================================== */
    const stats = document.querySelectorAll('.stat-number');
    
    const animateStats = () => {
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const duration = 2000; // 2s
            const increment = target / (duration / 16); // ~60fps
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    };

    // IntersectionObserver to animate stats when visible
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-banner');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }


    /* ==========================================
       7. CONTACT FORM HANDLER WITH TOAST
       ========================================== */
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading spinner
            btnSubmitForm.disabled = true;
            formSpinner.style.display = 'inline-block';
            const btnText = btnSubmitForm.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';

            const nameVal = document.getElementById('formName').value;

            // Check if Access Key is configured
            const accessKeyInput = document.getElementById('web3FormsAccessKey');
            if (accessKeyInput && accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
                console.warn('Web3Forms Access Key is not configured. Register at web3forms.com');
                
                // Simulate delay and warn the user
                setTimeout(() => {
                    btnSubmitForm.disabled = false;
                    formSpinner.style.display = 'none';
                    btnText.textContent = originalText;
                    showToast(`Demo: Submitted successfully! Add your Web3Forms Access Key to receive emails.`);
                    contactForm.reset();
                }, 1500);
                return;
            }

            // Prepare Form Data for Web3Forms API
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            // Send actual email via Web3Forms API
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let jsonRes = await response.json();
                if (response.status == 200) {
                    showToast(`Inquiry sent! Thank you ${nameVal}, we will contact you shortly.`);
                    contactForm.reset();
                } else {
                    console.error('Web3Forms Error:', jsonRes);
                    showToast(`Error: ${jsonRes.message || 'Could not send message. Please try again.'}`);
                }
            })
            .catch(error => {
                console.error('Network Error:', error);
                showToast("Connection error. Please check your internet or call us directly.");
            })
            .then(() => {
                // Reset loading state
                btnSubmitForm.disabled = false;
                formSpinner.style.display = 'none';
                btnText.textContent = originalText;
            });
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-check" style="color: #25d366; margin-right: 10px;"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        // Close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }
});
