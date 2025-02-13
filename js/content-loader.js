document.addEventListener('DOMContentLoaded', async function() {
    // Get current page info
    const currentPage = window.location.pathname.split('/').pop();
    const contentPath = `/content/${currentPage}`;

    // Content templates object
    const templates = {
        header: () => `
            <div class="frosted-container">
                <div id="content-inject"></div>
            </div>
        `,
        navigation: () => `
            <div class="page-navigation">
                <a class="nav-link prev-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" class="nav-arrow">
                        <path d="M15 18l-6-6 6-6" stroke="#FF9F1C" stroke-width="2" fill="none"/>
                    </svg>
                    <span class="nav-text">previous</span>
                </a>
                <a class="nav-link next-link">
                    <span class="nav-text">next</span>
                    <svg viewBox="0 0 24 24" width="20" height="20" class="nav-arrow">
                        <path d="M9 6l6 6-6 6" stroke="#FF9F1C" stroke-width="2" fill="none"/>
                    </svg>
                </a>
            </div>
        `
    };

    try {
        // Get the content section
        const contentSection = document.querySelector('.content-section');
        if (!contentSection) return;

        // Check if navigation needs to be added
        let navigation = document.querySelector('.page-navigation');
        
        if (!navigation) {
            // Create navigation if it doesn't exist
            const navElement = document.createElement('div');
            navElement.innerHTML = templates.navigation();
            navigation = navElement.firstElementChild;
            
            // Add navigation after content section
            contentSection.parentNode.insertBefore(
                navigation,
                contentSection.nextSibling
            );
        } else {
            // If navigation exists, ensure links don't have href="#"
            const links = navigation.querySelectorAll('a');
            links.forEach(link => {
                if (link.getAttribute('href') === '#') {
                    link.removeAttribute('href');
                }
            });
        }

        // Initialize navigation with a slight delay to ensure DOM is ready
        setTimeout(() => {
            if (typeof initializePageNavigation === 'function') {
                initializePageNavigation();
            }
        }, 50);

    } catch (error) {
        console.error('Error setting up page:', error);
    }
});