# 📸 Subida de Imágenes

Backend en Express + Multer para subir imágenes con validación, más un frontend simple con vista previa y galería.

## 🚀 Instalación

```bash
npm install
```

## ▶️ Ejecutar

```bash
npm run dev     # con nodemon (desarrollo)
npm start       # modo normal
```

Abre 👉 `http://localhost:3000`

## ✅ Criterios de validación

- 🖼️ **Tipos permitidos:** jpg, jpeg, png, gif
- 📏 **Tamaño máximo:** 5 MB
- 🔑 **Nombre único:** `Date.now() + extensión`
- 📡 **Respuestas HTTP:**
  - `201` → imagen subida con éxito
  - `400` → sin archivo válido / excede tamaño
  - `415` → tipo de archivo no permitido

## 🔗 Endpoints

- `GET /` → formulario de subida
- `POST /upload` → sube una imagen (campo `foto`)
- `GET /galeria` → lista imágenes subidas
