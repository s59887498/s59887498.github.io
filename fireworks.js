const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let fireworks = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update() {
        if (!this.exploded) {
            this.exploded = true;
        }

        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => !particle.done);
    }

    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.speed = Math.random() * 5 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.alpha = 1;
        this.color = color;
        this.done = false;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.02;
        if (this.alpha <= 0) {
            this.done = true;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function addFirework(x, y) {
    fireworks.push(new Firework(x, y));
}

function randomFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    addFirework(x, y);
}

canvas.addEventListener('click', (event) => {
    addFirework(event.clientX, event.clientY);
});

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach(firework => {
        firework.update();
        firework.draw();
    });

    fireworks = fireworks.filter(firework => firework.particles.length > 0);

    requestAnimationFrame(animate);
}

setInterval(randomFirework, 1000);

animate();
