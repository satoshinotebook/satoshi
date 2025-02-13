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
                <a href="#" class="nav-link prev-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" class="nav-arrow">
                        <path d="M15 18l-6-6 6-6" stroke="#FF9F1C" stroke-width="2" fill="none"/>
                    </svg>
                    <span class="nav-text">previous</span>
                </a>
                <a href="#" class="nav-link next-link">
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

        // Check if navigation already exists
        if (!document.querySelector('.page-navigation')) {
            // Add navigation after content section
            const navElement = document.createElement('div');
            navElement.innerHTML = templates.navigation();
            contentSection.parentNode.insertBefore(
                navElement.firstElementChild,
                contentSection.nextSibling
            );
        }

        // Initialize navigation
        initializePageNavigation();

    } catch (error) {
        console.error('Error setting up page:', error);
    }
});