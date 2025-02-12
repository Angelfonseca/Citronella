const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Función para asegurar que el directorio existe
const ensureDirectoryExists = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    } catch (error) {
        console.error(`Error al crear el directorio ${dirPath}:`, error);
    }
};

// Directorios de almacenamiento
const vestidosUploadDir = path.join(__dirname, '../../public/images/vestidos');
const jewelryUploadDir = path.join(__dirname, '../../public/images/joyeria');

// Asegurar que los directorios existen
ensureDirectoryExists(vestidosUploadDir);
ensureDirectoryExists(jewelryUploadDir);

// Generar un nombre de archivo único
const generateFileName = (file) => {
    if (!file || !file.originalname) return null;
    
    const ext = path.extname(file.originalname) || '.jpg'; // Default a .jpg si no tiene extensión
    const randomName = crypto.randomBytes(16).toString('hex'); // Genera un nombre único
    return `${Date.now()}-${randomName}${ext}`;
};

// Configuración de almacenamiento para vestidos
const savePictureVestidos = multer.diskStorage({
    destination: (req, file, cb) => cb(null, vestidosUploadDir),
    filename: (req, file, cb) => {
        const fileName = generateFileName(file);
        fileName ? cb(null, fileName) : cb(new Error('Invalid file'), false);
    }
});

// Configuración de almacenamiento para jewelry
const savePictureJewelry = multer.diskStorage({
    destination: (req, file, cb) => cb(null, jewelryUploadDir),
    filename: (req, file, cb) => {
        const fileName = generateFileName(file);
        fileName ? cb(null, fileName) : cb(new Error('Invalid file'), false);
    }
});

// Filtro de tipos de archivo aceptados
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type: Only JPEG, PNG, and JPG are allowed'), false);
    }
};

// Configuración de multer
exports.uploadDress = multer({ storage: savePictureVestidos, fileFilter });
exports.uploadJewelry = multer({ storage: savePictureJewelry, fileFilter });
