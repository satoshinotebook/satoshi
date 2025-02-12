// Main navigation loading function
async function loadNavigation() {
    try {
        const response = await fetch('/components/nav.html');
        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);
        initializeNavigationHandlers();
        initializeScrollHandlers();
        initializeCategoryToggles();
        initializeSidebar();
        initializePageNavigation(); // Add this line
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}

// Sidebar initialization
function initializeSidebar() {
    const nav = document.querySelector('.dot-nav');
    const logoButton = document.querySelector('.nav-logo');
    const overlay = document.querySelector('.sidebar-overlay');
    const pageContainer = document.querySelector('.page-container');
    
    function toggleMobileMenu(show) {
        if (show) {
            nav.classList.add('open');
            overlay.classList.add('active');
            // Let the transition handle the transform
            requestAnimationFrame(() => {
                pageContainer.style.transform = 'translateX(350px)';
            });
        } else {
            nav.classList.remove('open');
            overlay.classList.remove('active');
            requestAnimationFrame(() => {
                pageContainer.style.transform = 'translateX(0)';
            });
        }
    }

    // Toggle sidebar
    logoButton?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            const isOpen = nav.classList.contains('open');
            toggleMobileMenu(!isOpen);
        } else {
            nav.classList.toggle('collapsed');
            if (nav.classList.contains('collapsed')) {
                pageContainer.style.marginLeft = '0';
                pageContainer.style.width = '100%';
            } else {
                pageContainer.style.marginLeft = '350px';
                pageContainer.style.width = 'calc(100% - 350px)';
            }
        }
    });

    // Handle overlay clicks
    overlay?.addEventListener('click', () => {
        toggleMobileMenu(false);
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                nav.classList.remove('collapsed');
                pageContainer.style.marginLeft = '0';
                pageContainer.style.width = '100%';
                if (nav.classList.contains('open')) {
                    pageContainer.style.transform = 'translateX(350px)';
                } else {
                    pageContainer.style.transform = 'translateX(0)';
                }
            } else {
                nav.classList.remove('open');
                overlay.classList.remove('active');
                pageContainer.style.transform = 'translateX(0)';
                if (!nav.classList.contains('collapsed')) {
                    pageContainer.style.marginLeft = '350px';
                    pageContainer.style.width = 'calc(100% - 350px)';
                }
            }
        }, 50);
    });

    // Initialize state based on screen size
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        nav.classList.remove('open');
        overlay.classList.remove('active');
        pageContainer.style.transform = 'translateX(0)';
    } else {
        nav.classList.remove('open');
        pageContainer.style.marginLeft = '350px';
        pageContainer.style.width = 'calc(100% - 350px)';
        pageContainer.style.transform = 'none';
    }
}

// Page Navigation initialization
// Updated Page Navigation initialization
async function initializePageNavigation() {
    const navItems = Array.from(document.querySelectorAll('.dot-nav-item'));
    if (!navItems.length) {
        console.warn('No navigation items found');
        return;
    }

    const currentPath = window.location.pathname;
    const normalizedCurrentPath = currentPath
        .replace(/\.html$/, '')
        .replace(/\/$/, '')
        .replace(/^\/content\//, '/');
    
    const currentIndex = navItems.findIndex(item => {
        const itemPath = item.getAttribute('href')
            .replace(/\.html$/, '')
            .replace(/\/$/, '')
            .replace(/^\/content\//, '/');
        return itemPath === normalizedCurrentPath;
    });

    if (currentIndex === -1) {
        console.warn('Current page not found in navigation');
        return;
    }

    // Setup navigation links
    const prevLink = document.querySelector('.prev-link');
    const nextLink = document.querySelector('.next-link');

    if (!prevLink || !nextLink) {
        console.warn('Navigation links not found');
        return;
    }

    // Previous link
    if (currentIndex > 0) {
        const prevItem = navItems[currentIndex - 1];
        const prevLabel = prevItem.getAttribute('data-label');
        const prevHref = prevItem.getAttribute('href').replace(/\.html$/, '');
        
        prevLink.href = prevHref;
        prevLink.title = "Previous: " + prevLabel;
        prevLink.classList.remove('disabled');
        
        const prevText = prevLink.querySelector('.nav-text');
        if (prevText) {
            prevText.classList.add('text-right');
            prevText.innerHTML = `
                <span class="nav-direction">previous</span>
                <span class="nav-page-name">${prevLabel}</span>`;
        }
        
        // Remove old listener and add new one
        const newPrevLink = prevLink.cloneNode(true);
        prevLink.parentNode.replaceChild(newPrevLink, prevLink);
        newPrevLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation(prevHref);
        });
    } else {
        prevLink.classList.add('disabled');
        prevLink.href = '#';
        const prevText = prevLink.querySelector('.nav-text');
        if (prevText) {
            prevText.innerHTML = '<span class="nav-direction">previous</span>';
        }
    }

    // Next link
    if (currentIndex < navItems.length - 1) {
        const nextItem = navItems[currentIndex + 1];
        const nextLabel = nextItem.getAttribute('data-label');
        const nextHref = nextItem.getAttribute('href').replace(/\.html$/, '');
        
        nextLink.href = nextHref;
        nextLink.title = "Next: " + nextLabel;
        nextLink.classList.remove('disabled');
        
        const nextText = nextLink.querySelector('.nav-text');
        if (nextText) {
            nextText.classList.add('text-left');
            nextText.innerHTML = `
                <span class="nav-direction">next</span>
                <span class="nav-page-name">${nextLabel}</span>`;
        }
        
        // Remove old listener and add new one
        const newNextLink = nextLink.cloneNode(true);
        nextLink.parentNode.replaceChild(newNextLink, nextLink);
        newNextLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation(nextHref);
        });
    } else {
        nextLink.classList.add('disabled');
        nextLink.href = '#';
        const nextText = nextLink.querySelector('.nav-text');
        if (nextText) {
            nextText.innerHTML = '<span class="nav-direction">next</span>';
        }
    }
}

// Category handling
function initializeCategoryToggles() {
    const categoryToggles = document.querySelectorAll('.category-toggle');
    
    categoryToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !isExpanded);
            
            const categoryItems = toggle.nextElementSibling;
            if (isExpanded) {
                categoryItems.style.maxHeight = '0';
                categoryItems.style.opacity = '0';
            } else {
                categoryItems.style.maxHeight = categoryItems.scrollHeight + 'px';
                categoryItems.style.opacity = '1';
            }
            
            const categoryId = toggle.querySelector('.category-name').textContent;
            localStorage.setItem(`category-${categoryId}`, !isExpanded);
        });
        
        // Initialize state from localStorage
        const categoryId = toggle.querySelector('.category-name').textContent;
        const isExpanded = localStorage.getItem(`category-${categoryId}`) === 'true';
        if (isExpanded) {
            toggle.setAttribute('aria-expanded', 'true');
            const categoryItems = toggle.nextElementSibling;
            categoryItems.style.maxHeight = categoryItems.scrollHeight + 'px';
            categoryItems.style.opacity = '1';
        }
    });
}

// Scroll handling
function initializeScrollHandlers() {
    const navContent = document.querySelector('.nav-content');
    
    function checkScrollable() {
        if (navContent.scrollHeight > navContent.clientHeight) {
            navContent.classList.add('can-scroll');
        } else {
            navContent.classList.remove('can-scroll');
        }
    }

    function scrollToActive() {
        const activeItem = navContent.querySelector('.dot-nav-item.active');
        if (activeItem) {
            const itemTop = activeItem.offsetTop;
            const containerMiddle = navContent.clientHeight / 2;
            navContent.scrollTo({
                top: itemTop - containerMiddle,
                behavior: 'smooth'
            });
        }
    }

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    
    navContent.addEventListener('keydown', (e) => {
        const activeItem = document.querySelector('.dot-nav-item.active');
        if (!activeItem) return;

        const items = Array.from(document.querySelectorAll('.dot-nav-item:not([style*="display: none"])'));
        const currentIndex = items.indexOf(activeItem);

        if (e.key === 'ArrowUp' && currentIndex > 0) {
            e.preventDefault();
            items[currentIndex - 1].click();
            items[currentIndex - 1].focus();
        } else if (e.key === 'ArrowDown' && currentIndex < items.length - 1) {
            e.preventDefault();
            items[currentIndex + 1].click();
            items[currentIndex + 1].focus();
        }
    });

    navContent.addEventListener('wheel', (e) => {
        if (navContent.classList.contains('can-scroll')) {
            e.stopPropagation();
        }
    }, { passive: true });

    setTimeout(scrollToActive, 100);
}

// Navigation handlers
function initializeNavigationHandlers() {
    const nav = document.querySelector('.dot-nav');
    const pageContainer = document.querySelector('.page-container');

    document.querySelectorAll('.dot-nav-item').forEach(item => {
        item.setAttribute('tabindex', '0');
    });

    document.querySelectorAll('.dot-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.dot-nav-item').forEach(i => {
                i.classList.remove('active');
            });
            
            item.classList.add('active');

            const href = item.getAttribute('href');
            if (href) {
                handleNavigation(href).then(() => {
                    // Add this: Initialize page navigation after content is loaded
                    setTimeout(() => {
                        initializePageNavigation();
                    }, 50);
                });
            }

            if (window.innerWidth <= 768) {
                nav.classList.remove('open');
                document.querySelector('.sidebar-overlay').classList.remove('active');
                pageContainer.style.transform = 'none';
            }
        });
    });

    // Set active nav item based on current page
    setActiveNavItem();
}

async function handleNavigation(href) {
    try {
        const container = document.querySelector('.page-container');
        const nav = document.querySelector('.dot-nav');
        
        // Prevent multiple transitions from running
        if (container.classList.contains('transitioning')) return;
        
        // Add transitioning class
        container.classList.add('transitioning');
        
        // Start fade out
        container.style.opacity = '0';
        
        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Fetch new content
        const response = await fetch(href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get the new content
        const newContent = doc.querySelector('.page-content');
        
        if (newContent) {
            // Update URL without reload
            window.history.pushState({path: href}, '', href);
            document.title = doc.title;
            
            // Update content
            const currentContent = document.querySelector('.page-content');
            if (currentContent) {
                currentContent.replaceWith(newContent);
            } else {
                container.appendChild(newContent);
            }
            
            // Handle frosted glass effect
            const isHomePage = href === '/' || href.endsWith('index.html');
            if (isHomePage) {
                container.classList.add('home');
                container.style.background = 'none';
                container.style.backdropFilter = 'none';
                container.style.webkitBackdropFilter = 'none';
                container.style.borderLeft = 'none';
            } else {
                container.classList.remove('home');
                container.style.background = 'rgba(38, 38, 38, 0.5)';
                container.style.backdropFilter = 'blur(8px)';
                container.style.webkitBackdropFilter = 'blur(8px)';
                container.style.borderLeft = '1px solid rgba(255, 255, 255, 0.1)';
            }
            
            // Update navigation - IMPORTANT: This happens before fade in
            setActiveNavItem();
            
            // Initialize page navigation BEFORE fade in and ensure it completes
            await initializePageNavigation();
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                nav.classList.remove('open');
                document.querySelector('.sidebar-overlay')?.classList.remove('active');
                container.style.transform = 'none';
            }
            
            // Ensure DOM is updated before fade in
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            // Fade in
            container.style.opacity = '1';

            // Scroll to top of the page after navigation
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Remove transitioning class after animation
            setTimeout(() => {
                container.classList.remove('transitioning');
            }, 300);
        }
    } catch (error) {
        console.error('Navigation error:', error);
        // Reset state on error
        const container = document.querySelector('.page-container');
        container.style.opacity = '1';
        container.classList.remove('transitioning');
    }
}

// Add popstate handler for browser back/forward buttons
window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname);
});

function setActiveNavItem() {
    const currentPath = window.location.pathname;
    // Normalize the current path
    const normalizedCurrentPath = currentPath
        .replace(/\.html$/, '')
        .replace(/\/$/, '')
        .replace(/^\/content\//, '/');

    document.querySelectorAll('.dot-nav-item').forEach(item => {
        const itemPath = item.getAttribute('href')
            .replace(/\.html$/, '')
            .replace(/\/$/, '')
            .replace(/^\/content\//, '/');

        if (normalizedCurrentPath === itemPath) {
            item.classList.add('active');
            
            // Expand parent category
            const categoryGroup = item.closest('.category-group');
            if (categoryGroup) {
                const categoryToggle = categoryGroup.querySelector('.category-toggle');
                categoryToggle.setAttribute('aria-expanded', 'true');
                const categoryItems = categoryToggle.nextElementSibling;
                categoryItems.style.maxHeight = categoryItems.scrollHeight + 'px';
                categoryItems.style.opacity = '1';
            }
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadNavigation);
window.addEventListener('popstate', () => {
    setActiveNavItem();
    initializePageNavigation(); // Add this line
});