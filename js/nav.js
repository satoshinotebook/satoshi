// Function to clean URL
function getCleanUrl(path) {
    // Remove /content/ and .html
    return path.replace('/content/', '/').replace('.html', '');
}

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
function initializePageNavigation() {
    // Get all nav items in order
    const navItems = Array.from(document.querySelectorAll('.dot-nav-item'));
    
    // Find current page index
    const currentPath = window.location.pathname;
    const currentIndex = navItems.findIndex(item => {
        const itemPath = item.getAttribute('href');
        return itemPath === currentPath || itemPath === currentPath + '.html';
    });

    const prevLink = document.querySelector('.prev-link');
    const nextLink = document.querySelector('.next-link');

    if (prevLink && nextLink) {
        // First, remove any existing click listeners
        const newPrevLink = prevLink.cloneNode(true);
        const newNextLink = nextLink.cloneNode(true);
        prevLink.parentNode.replaceChild(newPrevLink, prevLink);
        nextLink.parentNode.replaceChild(newNextLink, nextLink);
        
        // Set previous link
        if (currentIndex > 0) {
            const prevItem = navItems[currentIndex - 1];
            const prevLabel = prevItem.getAttribute('data-label');
            newPrevLink.href = prevItem.getAttribute('href');
            newPrevLink.title = "Previous: " + prevLabel;
            newPrevLink.classList.remove('disabled');
            
            // Update to use stacked layout with right alignment
            const prevText = newPrevLink.querySelector('.nav-text');
            prevText.classList.add('text-right');
            prevText.innerHTML = `
                <span class="nav-direction">previous</span>
                <span class="nav-page-name">${prevLabel}</span>`;
            
            newPrevLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleNavigation(prevItem.getAttribute('href'));
            });
        } else {
            newPrevLink.classList.add('disabled');
        }

        // Set next link
        if (currentIndex < navItems.length - 1) {
            const nextItem = navItems[currentIndex + 1];
            const nextLabel = nextItem.getAttribute('data-label');
            newNextLink.href = nextItem.getAttribute('href');
            newNextLink.title = "Next: " + nextLabel;
            newNextLink.classList.remove('disabled');
            
            // Update to use stacked layout with left alignment
            const nextText = newNextLink.querySelector('.nav-text');
            nextText.classList.add('text-left');
            nextText.innerHTML = `
                <span class="nav-direction">next</span>
                <span class="nav-page-name">${nextLabel}</span>`;
            
            newNextLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleNavigation(nextItem.getAttribute('href'));
            });
        } else {
            newNextLink.classList.add('disabled');
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
        
        // Prevent multiple transitions
        if (container.classList.contains('transitioning')) return;
        
        container.classList.add('transitioning');
        container.style.opacity = '0';
        
        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Determine the fetch path and clean URL
        let fetchPath, cleanUrl;
        
        if (href.startsWith('/content/')) {
            // If it's a content path, convert to clean URL
            fetchPath = href;
            cleanUrl = href.replace('/content/', '/').replace('.html', '');
        } else {
            // If it's already a clean URL, construct the fetch path
            cleanUrl = href;
            fetchPath = `/content${href}.html`;
        }
        
        // Fetch new content
        const response = await fetch(fetchPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Get the new content
        const newContent = doc.querySelector('.page-content');
        
        if (newContent) {
            // Update URL with clean version
            window.history.pushState({}, '', cleanUrl);
            document.title = doc.title;
            
            // Update content
            const currentContent = document.querySelector('.page-content');
            if (currentContent) {
                currentContent.replaceWith(newContent);
            } else {
                container.appendChild(newContent);
            }
            
            // Handle frosted glass effect
            const isHomePage = cleanUrl === '/' || cleanUrl.endsWith('index');
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
            
            // Update navigation
            setActiveNavItem();
            
            // Initialize page navigation
            await new Promise(resolve => {
                setTimeout(() => {
                    initializePageNavigation();
                    resolve();
                }, 50);
            });
            
            // Handle mobile menu
            if (window.innerWidth <= 768) {
                nav.classList.remove('open');
                document.querySelector('.sidebar-overlay')?.classList.remove('active');
                container.style.transform = 'none';
            }
            
            // Ensure DOM is updated before fade in
            await new Promise(resolve => requestAnimationFrame(resolve));
            
            // Fade in
            container.style.opacity = '1';
            
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Remove transitioning class
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
        
        // On error, redirect to the clean URL directly
        const cleanUrl = href.replace('/content/', '/').replace('.html', '');
        window.location.href = cleanUrl;
    }
}

// Add popstate handler for browser back/forward buttons
window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname);
});

// Update setActiveNavItem function
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    document.querySelectorAll('.dot-nav-item').forEach(item => {
        const itemPath = getCleanUrl(item.getAttribute('href'));
        const itemPage = itemPath.split('/').pop();
        
        if (currentPage === itemPage) {
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