// shared-layout.js
const initializeMatrix = () => {
    console.log('Initializing matrix...');
    // Remove any existing canvas and overlay to prevent duplicates
    const existingCanvas = document.getElementById('matrix');
    const existingOverlay = document.getElementById('matrix-overlay');
    if (existingCanvas) {
        console.log('Removing existing canvas');
        existingCanvas.remove();
    }
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Add matrix canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix';
    document.body.insertBefore(canvas, document.body.firstChild);

    // Add overlay div
    const overlay = document.createElement('div');
    overlay.id = 'matrix-overlay';
    document.body.insertBefore(overlay, canvas.nextSibling);
    
    console.log('Canvas and overlay created and inserted');

    // Add matrix styles if not already present
    if (!document.querySelector('#matrix-styles')) {
        const style = document.createElement('style');
        style.id = 'matrix-styles';
        style.textContent = `
            canvas#matrix {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -2;
                opacity: 0.15;
                pointer-events: none;
            }
            
            #matrix-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.0);
                z-index: -1;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
        console.log('Matrix styles added');
    }

    // Load matrix.js with a Promise
    return new Promise((resolve, reject) => {
        const matrixScript = document.createElement('script');
        // Check if we're in the content folder by examining the current path
        const isInContentFolder = window.location.pathname.includes('/content/');
        matrixScript.src = isInContentFolder ? '../js/matrix.js' : 'js/matrix.js';
        matrixScript.onload = () => {
            console.log('Matrix script loaded successfully');
            // Wait a brief moment for the script to be processed
            setTimeout(() => {
                if (window.initMatrixAnimation) {
                    window.initMatrixAnimation();
                    console.log('Matrix animation initialized');
                    resolve();
                } else {
                    reject(new Error('Matrix animation function not found'));
                }
            }, 100);
        };
        matrixScript.onerror = (error) => {
            console.error('Error loading matrix script:', error);
            console.log('Attempted to load from:', matrixScript.src);
            reject(error);
        };
        document.head.appendChild(matrixScript);
    });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMatrix);
} else {
    initializeMatrix();
}

// Re-initialize on navigation (for your transition system)
document.addEventListener('page-transition-complete', initializeMatrix);