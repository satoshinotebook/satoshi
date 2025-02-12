// transitions.js
class PageTransitionManager {
    constructor() {
        this.pages = ['/', '/content/what-is-money.html', '/content/bitcoin-basics.html', '/content/hard-money.html', '/content/future-of-value.html'];
        this.currentPath = window.location.pathname;
        this.isTransitioning = false;
        this.initialized = false;
    }

    init() {
        // Wait for navigation to be loaded before initializing
        if (document.querySelector('.dot-nav')) {
            this.initNavigationListeners();
            this.initialized = true;
        } else {
            // If navigation isn't loaded yet, wait for it
            const observer = new MutationObserver((mutations, obs) => {
                if (document.querySelector('.dot-nav')) {
                    obs.disconnect();
                    this.initNavigationListeners();
                    this.initialized = true;
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Handle back/forward browser buttons
        window.addEventListener('popstate', (e) => {
            const targetPath = window.location.pathname;
            this.handleTransition(targetPath);
        });
    }

    initNavigationListeners() {
        // Remove existing listeners first to prevent duplicates
        this.removeExistingListeners();

        // Dot navigation listeners
        document.querySelectorAll('.dot-nav-item').forEach(dot => {
            dot.addEventListener('click', this.handleClick.bind(this));
            dot.setAttribute('data-has-listener', 'true');
        });

        // Next section listeners
        document.querySelectorAll('.next-section').forEach(link => {
            link.addEventListener('click', this.handleClick.bind(this));
            link.setAttribute('data-has-listener', 'true');
        });

        // Begin journey listener
        const beginJourney = document.querySelector('.begin-journey');
        if (beginJourney && !beginJourney.hasAttribute('data-has-listener')) {
            beginJourney.addEventListener('click', this.handleClick.bind(this));
            beginJourney.setAttribute('data-has-listener', 'true');
        }
    }

    removeExistingListeners() {
        // Remove listeners from elements that already have them
        document.querySelectorAll('[data-has-listener]').forEach(element => {
            element.removeEventListener('click', this.handleClick.bind(this));
            element.removeAttribute('data-has-listener');
        });
    }

    handleClick(e) {
        e.preventDefault();
        if (this.isTransitioning) return;
        const targetPath = e.currentTarget.getAttribute('href');
        this.handleTransition(targetPath);
    }

    async handleTransition(targetPath) {
        if (this.isTransitioning || targetPath === this.currentPath) return;
        
        this.isTransitioning = true;
        document.body.classList.add('transitioning');

        try {
            // Start fade out
            const container = document.querySelector('.page-container');
            container.style.opacity = '0';

            // Wait for fade out to complete
            await new Promise(resolve => setTimeout(resolve, 400));

            // Fetch new page content
            const response = await fetch(targetPath);
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const newContent = newDoc.querySelector('.page-content').innerHTML;

            // Update page content
            const pageContent = document.querySelector('.page-content');
            pageContent.innerHTML = newContent;

            // Update URL
            window.history.pushState({}, '', targetPath);
            this.currentPath = targetPath;

            // Trigger reflow before starting fade in
            void container.offsetWidth;

            // Start fade in
            container.style.opacity = '1';

            // Cleanup after animation
            setTimeout(() => {
                document.body.classList.remove('transitioning');
                this.isTransitioning = false;
            }, 400);

        } catch (error) {
            console.error('Transition error:', error);
            this.isTransitioning = false;
            document.body.classList.remove('transitioning');
        }
    }
}

// Initialize when DOM is loaded
let pageTransition;
document.addEventListener('DOMContentLoaded', () => {
    pageTransition = new PageTransitionManager();
    pageTransition.init();
});