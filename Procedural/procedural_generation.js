const canvas = document.getElementById('weaponCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Configuración de los colores
const backgroundColor = '#222';
const swordColor = '#888';
const wandColor = '#c66';
const bowColor = '#ab8';

function clearCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawSword() {
    ctx.fillStyle = swordColor;
    // Dibujar el mango
    ctx.fillRect(40, 100, 20, 80);
    // Dibujar la hoja
    ctx.fillRect(30, 80, 40, 20);
}

function drawWand() {
    ctx.fillStyle = wandColor;
    // Dibujar la base
    ctx.fillRect(45, 90, 10, 40);
    // Dibujar la punta
    ctx.fillRect(40, 70, 20, 20);
}

function drawBow() {
    ctx.fillStyle = bowColor;
    // Dibujar el arco
    ctx.fillRect(30, 110, 40, 20);
    // Dibujar la cuerda
    ctx.fillRect(45, 100, 10, 10);
}

// Generar una de las tres armas de manera aleatoria
function generateRandomWeapon() {
    clearCanvas();
    const randomWeaponIndex = Math.floor(Math.random() * 3);
    if (randomWeaponIndex === 0) {
        drawSword();
    } else if (randomWeaponIndex === 1) {
        drawWand();
    } else {
        drawBow();
    }
}

generateRandomWeapon();
