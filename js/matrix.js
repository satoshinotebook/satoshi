window.initMatrixAnimation = () => {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // Streamline physics parameters for each column
    const streamlines = [];
    
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

    // Initialize streamlines for each column
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize) * -1;
        colors[i] = Math.floor(Math.random() * orangePalette.length);
        columnOffsets[i] = 0;
        streamlines[i] = {
            offset: 0,
            velocity: 0
        };
    }

    const getNextColor = (currentIndex) => {
        if (Math.random() < 0.1) {
            return Math.floor(Math.random() * orangePalette.length);
        }
        return (currentIndex + 1) % orangePalette.length;
    };

    const calculateStreamDeflection = (x, y, index) => {
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 30; // Tighter radius of influence
        const stream = streamlines[index];
        
        // Tight, organic flow parameters
        const flowSpeed = 0.8;
        const deflectionStrength = 25;
        const recoveryRate = 0.15;

        if (distance < mouseRadius) {
            // Calculate deflection based on distance and angle
            const deflectionForce = (1 - distance / mouseRadius) * deflectionStrength;
            const targetOffset = Math.sign(dx) * deflectionForce;
            
            // Smooth transition to deflected state
            stream.velocity += (targetOffset - stream.offset) * flowSpeed;
        } else {
            // Natural flow recovery
            stream.velocity -= stream.offset * recoveryRate;
        }

        // Apply velocity with damping
        stream.velocity *= 0.9;
        stream.offset += stream.velocity;

        // Add subtle organic movement
        stream.offset += Math.sin(y * 0.01 + Date.now() * 0.001) * 0.2;

        return stream.offset;
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
                
                // Calculate stream deflection
                const offset = calculateStreamDeflection(i * fontSize, y, i);

                ctx.fillStyle = orangePalette[0];
                ctx.fillText(char, i * fontSize + offset, y);

                // Trailing characters follow the same flow
                for (let j = 1; j < 5; j++) {
                    if (drops[i] - j > 0) {
                        const trailChar = bitcoinChars[Math.floor(Math.random() * bitcoinChars.length)];
                        const trailY = y - j * fontSize;
                        const trailOffset = calculateStreamDeflection(i * fontSize, trailY, i);
                        ctx.fillStyle = `${baseColor}${Math.floor(90 - j * 20).toString(16)}`;
                        ctx.fillText(trailChar, i * fontSize + trailOffset, trailY);
                    }
                }
            }

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
                colors[i] = getNextColor(colors[i]);
            }

            drops[i]++;
        }

        // Random bright flashes
        for (let i = 0; i < drops.length; i++) {
            if (Math.random() < 0.001) {
                ctx.fillStyle = '#FFF';
                const y = drops[i] * fontSize;
                const flashOffset = calculateStreamDeflection(i * fontSize, y, i);
                ctx.fillText(bitcoinChars[Math.floor(Math.random() * bitcoinChars.length)],
                    i * fontSize + flashOffset, y);
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