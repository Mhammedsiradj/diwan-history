// ==================== MAIN JAVASCRIPT FILE ====================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    // Security initialized via security.js
});

// Initialize all components
function initializeComponents() {
    loadIncludes();
    setupNavigation();
    setupBackToTop();
    setupSmoothScroll();
    setupScrollReveal();
    setupReadingMode();
}

// Setup Advanced Reading Mode
function setupReadingMode() {
    const fab = document.createElement('div');
    fab.className = 'reading-fab';
    fab.innerHTML = '<i class="fas fa-book-open"></i>';
    fab.title = 'وضع القراءة المطور';
    
    const panel = document.createElement('div');
    panel.className = 'reading-settings-panel';
    panel.innerHTML = `
        <div class="setting-group">
            <div class="setting-label">حجم الخط</div>
            <div class="setting-options">
                <button class="setting-btn" onclick="adjustFontSize(-0.1)">A-</button>
                <button class="setting-btn" onclick="adjustFontSize(0.1)">A+</button>
            </div>
        </div>
        <div class="setting-group">
            <div class="setting-label">نوع الخط</div>
            <div class="setting-options">
                <button class="setting-btn" onclick="changeFont('Amiri')">أميري</button>
                <button class="setting-btn" onclick="changeFont('Reem Kufi')">كوفي</button>
                <button class="setting-btn" onclick="changeFont('Lateef')">لطيف</button>
            </div>
        </div>
        <div class="setting-group">
            <div class="setting-label">نمط العرض</div>
            <div class="setting-options">
                <button class="setting-btn active" id="btn-classic" onclick="changeMode('classic')">كلاسيك</button>
                <button class="setting-btn" id="btn-sepia" onclick="changeMode('sepia')">ورقي</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    
    fab.addEventListener('click', () => {
        panel.classList.toggle('active');
    });

    // Helper functions for reading mode (global for onclick)
    window.adjustFontSize = (delta) => {
        const container = document.querySelector('.container');
        if (!container) return;
        let currentSize = parseFloat(getComputedStyle(container).fontSize);
        container.style.fontSize = (currentSize + (delta * 16)) + 'px';
    };

    window.changeFont = (font) => {
        const container = document.querySelector('.container');
        if (container) container.style.setProperty('font-family', `"${font}", serif`, 'important');
    };

    window.changeMode = (mode) => {
        document.body.classList.remove('sepia-mode');
        document.querySelectorAll('.setting-btn').forEach(b => b.classList.remove('active'));
        
        if (mode === 'sepia') {
            document.body.classList.add('sepia-mode');
            document.getElementById('btn-sepia').classList.add('active');
        } else {
            document.getElementById('btn-classic').classList.add('active');
        }
    };
}

// Load header and footer includes with robust path detection
function loadIncludes() {
    // Dynamically find rootPrefix based on script tag location
    const scripts = document.getElementsByTagName('script');
    let rootPrefix = '';
    for (let script of scripts) {
        const src = script.getAttribute('src');
        if (src && src.includes('assets/js/main.js')) {
            rootPrefix = src.replace('assets/js/main.js', '');
            break;
        }
    }

    const includes = [
        { id: 'header', file: 'includes/header.html' },
        { id: 'footer', file: 'includes/footer.html' }
    ];

    includes.forEach(item => {
        const element = document.getElementById(item.id);
        if (element) {
            fetch(rootPrefix + item.file)
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    // Fix links in the loaded content
                    fixIncludeLinks(element, rootPrefix);
                    // Re-run nav setup if header was loaded
                    if (item.id === 'header') setupNavigation();
                })
                .catch(error => {
                    console.error(`Error loading ${item.id}:`, error);
                });
        }
    });
}

// Fix links in includes to match current page depth
function fixIncludeLinks(container, rootPrefix) {
    if (!rootPrefix) return; // If at root, no prefix needed
    
    const elements = container.querySelectorAll('a[href], img[src]');
    elements.forEach(el => {
        if (el.hasAttribute('href')) {
            const href = el.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
                el.setAttribute('href', rootPrefix + href);
            }
        }
        if (el.hasAttribute('src')) {
            const src = el.getAttribute('src');
            if (src && !src.startsWith('http') && !src.startsWith('data:')) {
                el.setAttribute('src', rootPrefix + src);
            }
        }
    });
}



// Setup navigation active state
function setupNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}

// Setup back to top button
function setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Setup smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Setup scroll reveal animations
function setupScrollReveal() {
    const elements = document.querySelectorAll('.hist-card, .figure-card, .index-item, .timeline-event');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.classList.add('scroll-hidden');
        observer.observe(element);
    });
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS class for scroll animations
const style = document.createElement('style');
style.textContent = `
    .scroll-hidden {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    .scroll-hidden.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);