// @ts-nocheck
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [],
    adjustX = 6,
    adjustY = 0;
ctx.lineWidth = 3;

// handle mouse movement
const mouse = {
    x: null,
    y: null,
    radius: 150,
};

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

//make it to mobile debices
window.addEventListener("touchmove", function (event) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});
window.addEventListener("touchstart", function () {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
});

ctx.fillStyle = "white";
ctx.font = "25px Arial";
ctx.fillText("Beto", 0, 30);
const textCoordinates = ctx.getImageData(0, 0, 1000, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 8 + 1;
    }
    draw() {
        ctx.fillStyle = "rgb(255, 255, 255,0.8)";
        ctx.strokeStyle = "rgb(34, 147, 214,1)";
        ctx.beginPath();

        if (this.distance < mouse.radius - 15) {
            this.size = 13;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 3, this.y - 3, this.size / 2.5, 0, Math.PI * 2);
            ctx.arc(this.x + 7, this.y - 1, this.size / 3.5, 0, Math.PI * 2);
        } else if (this.distance <= mouse.radius) {
            this.size = 10;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 2, this.y - 2, this.size / 3, 0, Math.PI * 2);
        } else {
            this.size = 8;
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(this.x - 1, this.y - 1, this.size / 3, 0, Math.PI * 2);
        }

        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        this.distance = distance;
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}

function init() {
    particleArray = [];
    for (let i = 0, i2 = textCoordinates.height; i < i2; i++) {
        for (let j = 0, j2 = textCoordinates.width; j < j2; j++) {
            if (
                textCoordinates.data[
                    j * 4 * textCoordinates.width + i * 4 + 3
                ] > 128
            ) {
                let positionX = i + adjustX;
                let positionY = j + adjustY;
                particleArray.push(
                    new Particle(positionX * 20, positionY * 20)
                );
            }
        }
    }
}
init();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    // connect();
    requestAnimationFrame(animate);
}
animate();

function connect() {
    let opacityValue = 1;
    for (let i = 0; i < particleArray.length; i++) {
        for (let j = 0; j < particleArray.length; j++) {
            let dx = particleArray[i].x - particleArray[j].x,
                dy = particleArray[i].y - particleArray[j].y,
                distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - distance / 50;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
            if (distance < 50) {
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particleArray[i].x, particleArray[i].y);
                ctx.lineTo(particleArray[j].x, particleArray[j].y);
                ctx.stroke();
            }
        }
    }
}
