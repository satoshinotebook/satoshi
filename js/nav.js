// Unified initialization function
function reinitializeNavigation() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            setActiveNavItem();
            initializePageNavigation();
            resolve();
        });
    });
}

// Main navigation loading function
async function loadNavigation() {
    try {
        const response = await fetch('/components/nav.html');
        const html = await response.text();
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Initialize all components
        initializeNavigationHandlers();
        initializeScrollHandlers();
        initializeCategoryToggles();
        initializeSidebar();
        
        // Ensure navigation is properly initialized
        await reinitializeNavigation();
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
    
    if (!nav || !pageContainer) return;
    
    function toggleMobileMenu(show) {
        if (show) {
            nav.classList.add('open');
            overlay?.classList.add('active');
            requestAnimationFrame(() => {
                pageContainer.style.transform = 'translateX(350px)';
            });
        } else {
            nav.classList.remove('open');
            overlay?.classList.remove('active');
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

    // Handle window resize with debounce
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
                overlay?.classList.remove('active');
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
        overlay?.classList.remove('active');
        pageContainer.style.transform = 'translateX(0)';
    } else {
        nav.classList.remove('open');
        pageContainer.style.marginLeft = '350px';
        pageContainer.style.width = 'calc(100% - 350px)';
        pageContainer.style.transform = 'none';
    }
}

// Page Navigation initialization with retry logic
function initializePageNavigation(retryCount = 0, maxRetries = 3) {
    const navItems = Array.from(document.querySelectorAll('.dot-nav-item'));
    const prevLink = document.querySelector('.prev-link');
    const nextLink = document.querySelector('.next-link');
    
    // Check if required elements exist
    if ((!prevLink || !nextLink || navItems.length === 0) && retryCount < maxRetries) {
        console.log(`Retrying navigation initialization (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
            initializePageNavigation(retryCount + 1, maxRetries);
        }, Math.min(100 * Math.pow(2, retryCount), 1000));
        return;
    }

    // Find current page index
    const currentPath = window.location.pathname;
    const currentIndex = navItems.findIndex(item => {
        const itemPath = item.getAttribute('href');
        return itemPath === currentPath || itemPath === currentPath + '.html';
    });

    if (prevLink && nextLink) {
        // Create fresh elements to avoid event listener buildup
        const newPrevLink = prevLink.cloneNode(true);
        const newNextLink = nextLink.cloneNode(true);
        
        // Set up previous link
        if (currentIndex > 0) {
            const prevItem = navItems[currentIndex - 1];
            const prevLabel = prevItem.getAttribute('data-label');
            newPrevLink.href = prevItem.getAttribute('href');
            newPrevLink.title = "Previous: " + prevLabel;
            newPrevLink.classList.remove('disabled');
            
            const prevText = newPrevLink.querySelector('.nav-text');
            if (prevText) {
                prevText.classList.add('text-right');
                prevText.innerHTML = `
                    <span class="nav-direction">previous</span>
                    <span class="nav-page-name">${prevLabel}</span>`;
            }
            
            newPrevLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleNavigation(prevItem.getAttribute('href'));
            });
        } else {
            newPrevLink.classList.add('disabled');
        }

        // Set up next link
        if (currentIndex < navItems.length - 1) {
            const nextItem = navItems[currentIndex + 1];
            const nextLabel = nextItem.getAttribute('data-label');
            newNextLink.href = nextItem.getAttribute('href');
            newNextLink.title = "Next: " + nextLabel;
            newNextLink.classList.remove('disabled');
            
            const nextText = newNextLink.querySelector('.nav-text');
            if (nextText) {
                nextText.classList.add('text-left');
                nextText.innerHTML = `
                    <span class="nav-direction">next</span>
                    <span class="nav-page-name">${nextLabel}</span>`;
            }
            
            newNextLink.addEventListener('click', (e) => {
                e.preventDefault();
                handleNavigation(nextItem.getAttribute('href'));
            });
        } else {
            newNextLink.classList.add('disabled');
        }

        // Replace old elements with new ones
        prevLink.parentNode.replaceChild(newPrevLink, prevLink);
        nextLink.parentNode.replaceChild(newNextLink, nextLink);
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
            if (categoryItems) {
                if (isExpanded) {
                    categoryItems.style.maxHeight = '0';
                    categoryItems.style.opacity = '0';
                } else {
                    categoryItems.style.maxHeight = categoryItems.scrollHeight + 'px';
                    categoryItems.style.opacity = '1';
                }
                
                const categoryId = toggle.querySelector('.category-name')?.textContent;
                if (categoryId) {
                    localStorage.setItem(`category-${categoryId}`, !isExpanded);
                }
            }
        });
        
        // Initialize state from localStorage
        const categoryId = toggle.querySelector('.category-name')?.textContent;
        if (categoryId) {
            const isExpanded = localStorage.getItem(`category-${categoryId}`) === 'true';
            if (isExpanded) {
                toggle.setAttribute('aria-expanded', 'true');
                const categoryItems = toggle.nextElementSibling;
                if (categoryItems) {
                    categoryItems.style.maxHeight = categoryItems.scrollHeight + 'px';
                    categoryItems.style.opacity = '1';
                }
            }
        }
    });
}

// Scroll handling
function initializeScrollHandlers() {
    const navContent = document.querySelector('.nav-content');
    if (!navContent) return;
    
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

    if (!nav || !pageContainer) return;

    document.querySelectorAll('.dot-nav-item').forEach(item => {
        item.setAttribute('tabindex', '0');
        
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            
            document.querySelectorAll('.dot-nav-item').forEach(i => {
                i.classList.remove('active');
            });
            
            item.classList.add('active');

            const href = item.getAttribute('href');
            if (href) {
                await handleNavigation(href);
            }

            if (window.innerWidth <= 768) {
                nav.classList.remove('open');
                document.querySelector('.sidebar-overlay')?.classList.remove('active');
                pageContainer.style.transform = 'none';
            }
        });
    });

    setActiveNavItem();
}

// Handle navigation with proper state management
async function handleNavigation(href) {
    try {
        const container = document.querySelector('.page-container');
        if (!container || container.classList.contains('transitioning')) return;
        
        container.classList.add('transitioning');
        container.style.opacity = '0';
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const response = await fetch(href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const newContent = doc.querySelector('.page-content');
        
        if (newContent) {
            if (window.location.pathname !== href) {
                window.history.pushState({}, '', href);
            }
            document.title = doc.title;
            
            const currentContent = document.querySelector('.page-content');
            if (currentContent) {
                currentContent.replaceWith(newContent);
            } else {
                container.appendChild(newContent);
            }
            
            const isHomePage = href === '/' || href.endsWith('index.html');
            container.classList.toggle('home', isHomePage);
            
            if (!isHomePage) {
                container.style.background = 'rgba(38, 38, 38, 0.5)';
                container.style.backdropFilter = 'blur(8px)';
                container.style.webkitBackdropFilter = 'blur(8px)';
                container.style.borderLeft = '1px solid rgba(255, 255, 255, 0.1)';
            } else {
                container.style.background = 'none';
                container.style.backdropFilter = 'none';
                container.style.webkitBackdropFilter = 'none';
                container.style.borderLeft = 'none';
            }
            
            await reinitializeNavigation();
            
            if (window.innerWidth <= 768) {
                const nav = document.querySelector('.dot-nav');
                nav?.classList.remove('open');
                document.querySelector('.sidebar-overlay')?.classList.remove('active');
                container.style.transform = 'none';
            }
            
            await new Promise(resolve => requestAnimationFrame(resolve));
            container.style.opacity = '1';
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                container.classList.remove('transitioning');
            }, 300);
        }
    } catch (error) {
        console.error('Navigation error:', error);
        const container = document.querySelector('.page-container');
        container.style.opacity = '1';
        container.classList.remove('transitioning');
        window.location.href = href;
    }
}

// Set active navigation item
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();

    document.querySelectorAll('.dot-nav-item').forEach(item => {
        const itemPath = item.getAttribute('href');
        const itemPage = itemPath.split('/').pop();

        if (currentPage === itemPage) {
            item.classList.add('active');
            
            // Expand parent category
            const categoryGroup = item.closest('.category-group');
            if (categoryGroup) {
                const categoryToggle = categoryGroup.querySelector('.category-toggle');
                if (categoryToggle) {
                    categoryToggle.setAttribute('aria-expanded', 'true');
                    const categoryItems = categoryToggle.nextElementSibling;
                    if (categoryItems) {
                        categoryItems.style.maxHeight = categoryItems.scrollHeight + 'px';
                        categoryItems.style.opacity = '1';
                    }
                }
            }
        } else {
            item.classList.remove('active');
        }
    });
}

// Setup navigation observer for dynamic content
function setupNavigationObserver() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                requestAnimationFrame(() => {
                    initializePageNavigation();
                });
                break;
            }
        }
    });

    const navContainer = document.querySelector('.page-container');
    if (navContainer) {
        observer.observe(navContainer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    await loadNavigation();
    setupNavigationObserver();
});

// Single popstate handler for browser back/forward
window.addEventListener('popstate', () => {
    handleNavigation(window.location.pathname);
});