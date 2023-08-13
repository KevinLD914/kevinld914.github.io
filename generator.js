const canvas = document.getElementById('weaponCanvas');
const ctx = canvas.getContext('2d');
const generateButton = document.getElementById('generateBtn');
const downloadButton = document.getElementById('downloadBtn');
const weaponNameElement = document.getElementById('weaponName');
const weaponDescriptionElement = document.getElementById('weaponDescription');
const weaponRarityElement = document.getElementById('weaponRarity');
const weaponDamageElement = document.getElementById('weaponDamage');
const weaponClassElement = document.getElementById('weaponClass');
const footer = document.getElementById('footer');
const damageMultiplierInput = document.getElementById('damageMultiplier');
const damageMultiplierValue = document.getElementById('damageMultiplierValue');

const spriteCounts = {
    espada: 5,   // Cambiar estos valores con la cantidad real de sprites en cada carpeta
    varita: 3,
    arco: 3
};

const weaponTypes = ['espada', 'varita', 'arco'];
const rarities = ['Común', 'Poco Común', 'Raro', 'Épico', 'Legendario'];

let randomSpriteIndex; // Variable global para almacenar el índice de sprite generado
let randomWeaponType; // Variable global para almacenar el tipo de arma generado
let generatedWeaponStats; // Variable global para almacenar las estadísticas generadas

// Set the canvas dimensions to match the sprite size
canvas.width = 128; // Adjust this based on your sprite dimensions
canvas.height = 128; // Adjust this based on your sprite dimensions

generateButton.addEventListener('click', generateWeapon);
downloadButton.addEventListener('click', downloadScript);

damageMultiplierInput.addEventListener('input', () => {
    damageMultiplierValue.textContent = damageMultiplierInput.value;
    if (generatedWeaponStats) {
        generatedWeaponStats = generateRandomStats(generatedWeaponStats.data, generatedWeaponStats.rarityIndex, parseFloat(damageMultiplierInput.value));
        weaponDamageElement.textContent = `Daño: ${generatedWeaponStats.damage}`;
    }
});

async function generateWeapon() {
    try {
        footer.textContent = ''; // Clear previous error message
        randomWeaponType = weaponTypes[Math.floor(Math.random() * weaponTypes.length)];
        const randomRarityIndex = Math.floor(Math.random() * rarities.length);
        const randomRarity = rarities[randomRarityIndex];
        randomSpriteIndex = getRandomSpriteIndex(); // Almacenar el índice de sprite generado
        const spriteImagePath = `sprites/${randomWeaponType}/${randomWeaponType}${randomSpriteIndex}.png`;

        const response = await fetch('db.json');
        const data = await response.json();

        generatedWeaponStats = generateRandomStats(data[randomWeaponType], randomRarityIndex, parseFloat(damageMultiplierInput.value)); // Almacenar las estadísticas generadas
        weaponNameElement.textContent = generatedWeaponStats.name;
        weaponDescriptionElement.textContent = generatedWeaponStats.description;
        weaponRarityElement.textContent = `Rareza: ${randomRarity}`;
        weaponDamageElement.textContent = `Daño: ${generatedWeaponStats.damage}`;
        weaponClassElement.textContent = `Clase: ${randomWeaponType}`;

        const spriteImage = new Image();
        spriteImage.onload = () => {
            drawWeapon(spriteImage, randomRarityIndex);
        };
        spriteImage.onerror = (error) => {
            footer.textContent = `Error al cargar la imagen: ${error}`;
        };
        spriteImage.src = spriteImagePath;
    } catch (error) {
        console.error('Error fetching data:', error);
        footer.textContent = `Error: ${error}`;
    }
}

function downloadScript() {
    try {
        if (!generatedWeaponStats || !randomWeaponType || !randomSpriteIndex) {
            footer.textContent = 'Primero genera un arma antes de descargar el script y el sprite.';
            return;
        }

        // Deshabilitar el botón de descarga
        downloadButton.disabled = true;

        const weaponName = generatedWeaponStats.name;
        const randomRarityIndex = Math.floor(Math.random() * rarities.length);
        const randomRarity = rarities[randomRarityIndex];
        const scriptContent = `
using UnityEngine;

public class ${weaponName} : MonoBehaviour
{
    public string weaponName = "${weaponName}";
    public string weaponDescription = "${generatedWeaponStats.description}";
    public string weaponRarity = "${randomRarity}";
    public int weaponDamage = ${generatedWeaponStats.damage};
    public Sprite weaponSprite; // Reference to the weapon sprite
}
        `;

        const zip = new JSZip();
        zip.file(`${weaponName}.cs`, scriptContent);

        const spriteImagePath = `sprites/${randomWeaponType}/${randomWeaponType}${randomSpriteIndex}.png`;
        const spriteImage = new Image();
        spriteImage.crossOrigin = "Anonymous";
        spriteImage.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = spriteImage.width;
            canvas.height = spriteImage.height;
            ctx.drawImage(spriteImage, 0, 0);

            canvas.toBlob((blob) => {
                zip.file(`${weaponName}_sprite.png`, blob);
                zip.generateAsync({ type: 'blob' })
                   .then((content) => {
                       const zipDownloadLink = document.createElement('a');
                       zipDownloadLink.href = URL.createObjectURL(content);
                       zipDownloadLink.download = `${weaponName}_files.zip`;
                       document.body.appendChild(zipDownloadLink);
                       zipDownloadLink.click();
                       document.body.removeChild(zipDownloadLink);

                       // Habilitar el botón de descarga nuevamente después de la descarga
                       downloadButton.disabled = false;
                   });
            });
        };
        spriteImage.src = spriteImagePath;
    } catch (error) {
        console.error('Error al generar el script y el sprite:', error);
        footer.textContent = `Error: ${error}`;

        // Habilitar el botón de descarga en caso de error
        downloadButton.disabled = false;
    }
}


function downloadSprite(weaponName, weaponType, spriteIndex) {
    const spriteImagePath = `sprites/${weaponType}/${weaponType}${spriteIndex}.png`;
    const spriteImage = new Image();
    spriteImage.crossOrigin = "Anonymous";
    spriteImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = spriteImage.width;
        canvas.height = spriteImage.height;
        ctx.drawImage(spriteImage, 0, 0);

        canvas.toBlob((blob) => {
            const spriteDownloadLink = document.createElement('a');
            spriteDownloadLink.href = URL.createObjectURL(blob);
            spriteDownloadLink.download = `${weaponName}_sprite.png`;
            document.body.appendChild(spriteDownloadLink);
            spriteDownloadLink.click();
            document.body.removeChild(spriteDownloadLink);
        });
    };
    spriteImage.src = spriteImagePath;
}

function drawWeapon(spriteImage, rarityIndex) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getRarityColor(rarityIndex);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate the scaling factor to fit the sprite into the canvas
    const scalingFactor = Math.min(canvas.width / spriteImage.width, canvas.height / spriteImage.height);
    
    const scaledWidth = spriteImage.width * scalingFactor;
    const scaledHeight = spriteImage.height * scalingFactor;
    
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;

    ctx.drawImage(spriteImage, offsetX, offsetY, scaledWidth, scaledHeight);
    
    // Resto del código para mostrar stats...
}

function getRandomSpriteIndex() {
    const availableSprites = spriteCounts[randomWeaponType];
    return Math.floor(Math.random() * availableSprites) + 1;
}

function generateRandomStats(weaponData, rarityIndex) {
    const randomDamage = Math.floor(Math.random() * 100) + 50;
    const rarityMultiplier = 1 + rarityIndex * 0.2; // Adjust multiplier as needed

    return {
        name: weaponData.names[Math.floor(Math.random() * weaponData.names.length)],
        description: weaponData.descriptions[Math.floor(Math.random() * weaponData.descriptions.length)],
        damage: Math.floor(randomDamage * rarityMultiplier),
        // Include other stats here...
    };
}

function getRarityColor(rarityIndex) {
    switch (rarityIndex) {
        case 0:
            return '#ddd';
        case 1:
            return '#5cb85c';
        case 2:
            return '#428bca';
        case 3:
            return '#d9534f';
        case 4:
            return '#9b59b6';
        default:
            return '#ddd';
    }
}



generateWeapon();
