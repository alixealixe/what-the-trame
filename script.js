const upload = document.getElementById('upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('downloadImage');

// Sélection des éléments pour les réglages
const dotSizeInput = document.getElementById('dotSize');
const spacingInput = document.getElementById('spacing');
const colorInput = document.getElementById('color');
const shapeInput = document.getElementById('shape');
const dotSizeDisplay = document.getElementById('dotSizeValue');
const spacingDisplay = document.getElementById('spacingValue');

// Limites pour la taille de l'image
const MAX_WIDTH = 900;
const MAX_HEIGHT = 700;

let img = new Image();
let imgLoaded = false;
let originalImageData = null; // Pour stocker les données de l'image originale

// Initialiser les valeurs affichées avec les valeurs par défaut
dotSizeDisplay.textContent = dotSizeInput.value; // Affiche la valeur par défaut "10"
spacingDisplay.textContent = spacingInput.value; // Affiche la valeur par défaut "5"

// Met à jour l'affichage de la valeur de dotSize et spacing en temps réel
dotSizeInput.addEventListener('input', () => {
  dotSizeDisplay.textContent = dotSizeInput.value;
  applyHalftone(); // Mise à jour en temps réel
});

spacingInput.addEventListener('input', () => {
  spacingDisplay.textContent = spacingInput.value;
  applyHalftone(); // Mise à jour en temps réel
});

// Met à jour la trame en temps réel lorsque la couleur change
colorInput.addEventListener('input', () => {
  applyHalftone();
});

upload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    img.src = event.target.result;
    imgLoaded = true;
  };

  reader.readAsDataURL(file);
});

img.onload = function () {
  let width = img.width;
  let height = img.height;

  // Redimensionner l'image en fonction de la dimension dominante tout en conservant les proportions
  const aspectRatio = width / height;

  if (width > height) {
    // Si l'image est plus large que haute
    width = MAX_WIDTH;
    height = width / aspectRatio;
  } else {
    // Si l'image est plus haute que large
    height = MAX_HEIGHT;
    width = height * aspectRatio;
  }

  // Ajuster la taille du canvas pour qu'il contienne l'image
  canvas.width = width;
  canvas.height = height;

  // Dessiner l'image dans le canvas
  ctx.drawImage(img, 0, 0, width, height);

  // Récupérer les données de l'image (pour la trame)
  originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Effacer l'image après avoir récupéré les données
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Appliquer la trame initiale avec les réglages par défaut
  applyHalftone();
};

// Fonction pour appliquer l'effet de trame
function applyHalftone() {
  if (!imgLoaded || !originalImageData) {
    alert('You have to upload an image first ;)');
    return;
  }

  const dotSize = parseInt(dotSizeInput.value); // Taille des points
  const spacing = parseInt(spacingInput.value); // Espacement entre les points
  const color = colorInput.value; // Couleur des points
  const shape = shapeInput.value; // Forme des points (cercle ou carré)

  const imgData = originalImageData; // Utilisation des données de l'image originale
  const pixels = imgData.data;
  const width = imgData.width;
  const height = imgData.height;

  // Effacer le canvas avant de dessiner la trame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Appliquer la trame en parcourant les pixels par bloc
  for (let y = 0; y < height; y += spacing) {
    for (let x = 0; x < width; x += spacing) {
      const index = (y * width + x) * 4;
      const r = pixels[index]; // On ne prend que la composante rouge pour le niveau de gris

      // Calculer la taille du point en fonction de la luminosité
      const grayValue = r;
      const size = (255 - grayValue) / 255 * (dotSize / 2);

      ctx.fillStyle = color;

      if (shape === "circle") {
        // Dessiner un cercle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI, false);
        ctx.fill();
      } else if (shape === "square") {
        // Dessiner un carré
        ctx.fillRect(x - size, y - size, size * 2, size * 2);
      }
    }
  }
}

// Fonction pour télécharger l'image
function downloadImage() {
  const link = document.createElement('a');
  link.download = 'halftone_image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Ajouter un événement pour télécharger l'image
downloadButton.addEventListener('click', () => {
  if (!imgLoaded) {
    alert('Veuillez d\'abord télécharger et appliquer l\'effet sur une image.');
    return;
  }
  downloadImage();
});

// Sélectionner la ligne des points animés
const dotsLine = document.querySelector('.dots-line');

// Calculer le nombre de points nécessaires pour remplir la ligne
const numDots = Math.floor(window.innerWidth / 20); // Ajustez '20' pour la distance entre les points

// Générer les points avec un effet de décalage d'animation
for (let i = 0; i < numDots; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  
  // Décalage progressif de l'animation pour chaque point
  dot.style.animationDelay = `${i * 0.1}s`;
  dot.style.animationDuration = '2s'; // Durée de l'animation de vague
  
  dotsLine.appendChild(dot);
}
