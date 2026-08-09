const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = 3000;

// asegurar carpeta uploads
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// almacenamiento con nombre único
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}${ext}`);
    }
});

// filtros y límites
const fileFilter = (_req, file, cb) => {
    const ok = /image\/(jpeg|png|gif)/.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Tipo de archivo no permitido. Solo jpg, jpeg, png, gif.'));
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter
});

// estáticos
app.use(express.static(path.join(__dirname, 'public')));

// endpoint de subida
app.post('/upload', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ ok: false, mensaje: 'No se recibió una imagen válida' });
    }
    res.status(201).json({
        ok: true,
        mensaje: 'Imagen subida',
        archivo: req.file.filename,
        ruta: `/uploads/${req.file.filename}`
    });
});

// manejo básico de errores de Multer
app.use((err, _req, res, _next) => {
    if (err instanceof multer.MulterError) {
        // p.ej. límite de tamaño
        return res.status(400).json({ ok: false, mensaje: err.message });
    }
    if (err) {
        return res.status(415).json({ ok: false, mensaje: err.message });
    }
    res.status(500).json({ ok: false, mensaje: 'Error interno' });
});

// endpoint de galería
app.get('/galeria', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ ok: false, mensaje: 'No se pudo leer la galería' });
        }

        const imagenes = files.map((filename) => {
            const filePath = path.join(UPLOAD_DIR, filename);
            const stats = fs.statSync(filePath);
            const ext = path.extname(filename).toLowerCase().replace('.', '');
            const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif' };

            return {
                nombre: filename,
                ruta: `/uploads/${filename}`,
                tipo: mimeMap[ext] || 'desconocido',
                tamano: stats.size // en bytes
            };
        });

        res.status(200).json({ ok: true, imagenes });
    });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));