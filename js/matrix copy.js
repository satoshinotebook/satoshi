// matrix.js
window.initMatrixAnimation = () => {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bitcoinChars = '₿BLOCKCHAIN1234567890SATOSHINAKAMOTOPOW'.split('');
    const orangePalette = [
        '#FFE5CC',
        '#FFD4A3',
        '#FFBF75',
        '#FF9F1C',
        '#FF8C00',
        '#FF4500'
    ];

    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    const colors = [];
    const columnOffsets = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
        colors[i] = Math.floor(Math.random() * orangePalette.length);
        columnOffsets[i] = 0;
    }

    const getNextColor = (currentIndex) => {
        if (Math.random() < 0.1) {
            return Math.floor(Math.random() * orangePalette.length);
        }
        return (currentIndex + 1) % orangePalette.length;
    };

    const getStreamOffset = (x, y, currentOffset) => {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 150;
        const maxDisplacement = 40;

        if (distance < mouseRadius) {
            const angle = Math.atan2(dy, dx);
            const force = Math.pow((mouseRadius - distance) / mouseRadius, 1.5);
            const offset = force * maxDisplacement;
            return offset * Math.cos(angle);
        }
        return currentOffset;
    };

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            if (drops[i] > 0) {
                const char = bitcoinChars[Math.floor(Math.random() * bitcoinChars.length)];
                const baseColor = orangePalette[colors[i]];
                const y = drops[i] * fontSize;
                
                const newOffset = getStreamOffset(i * fontSize, y, columnOffsets[i]);
                columnOffsets[i] = columnOffsets[i] * 0.9 + newOffset * 0.1;

                ctx.fillStyle = orangePalette[0];
                ctx.fillText(char, i * fontSize + columnOffsets[i], y);

                for (let j = 1; j < 5; j++) {
                    if (drops[i] - j > 0) {
                        const trailChar = bitcoinChars[Math.floor(Math.random() * bitcoinChars.length)];
                        const trailY = y - j * fontSize;
                        ctx.fillStyle = `${baseColor}${Math.floor(90 - j * 20).toString(16)}`;
                        ctx.fillText(trailChar, i * fontSize + columnOffsets[i], trailY);
                    }
                }
            }

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                colors[i] = getNextColor(colors[i]);
            }

            drops[i]++;
        }

        for (let i = 0; i < drops.length; i++) {
            if (Math.random() < 0.001) {
                ctx.fillStyle = '#FFF';
                const y = drops[i] * fontSize;
                ctx.fillText(bitcoinChars[Math.floor(Math.random() * bitcoinChars.length)],
                    i * fontSize + columnOffsets[i], y);
            }
        }
    }

    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    function animate(currentTime) {
        if (currentTime - lastTime >= interval) {
            draw();
            lastTime = currentTime;
        }
        requestAnimationFrame(animate);
    }

    animate(0);
};

// Don't auto-initialize, wait for shared-layout.js to call it