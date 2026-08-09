const photoInput = document.getElementById('photoInput');
const previewContainer = document.getElementById('previewContainer');
const imgPreview = document.getElementById('imgPreview');
const form = document.getElementById('formUpload');
const feedback = document.getElementById('feedback');
const galleryContainer = document.getElementById('galleryContainer');


// Vista previa al seleccionar archivo
photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];

    if (file) {
        const url = URL.createObjectURL(file);
        imgPreview.src = url;
        previewContainer.style.display = 'block';
    } else {
        previewContainer.style.display = 'none';
        imgPreview.src = '';
    }
});

// Envío del formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    try {
        const res = await fetch('/upload', { method: 'POST', body: data });
        const json = await res.json();
        feedback.style.display = 'block';
        feedback.className = 'alert ' + (json.ok ? 'alert-success' : 'alert-danger');
        feedback.textContent = json.mensaje || (json.ok ? 'OK' : 'Error');

        if (json.ok) {
            loadGallery(); // 👈 agrega esto
        }
    } catch (err) {
        feedback.style.display = 'block';
        feedback.className = 'alert alert-danger';
        feedback.textContent = 'Error de red';
    }
});

// Cargar y mostrar la galería de fotos

async function loadGallery() {
    try {
        const res = await fetch('/galeria');
        const json = await res.json();
        console.log('Galería cargada', json);
        galleryContainer.innerHTML = '';

        if (!json.ok || json.imagenes.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'text-muted';
            empty.textContent = 'Aún no hay imágenes subidas.';
            galleryContainer.appendChild(empty);
            return;
        }

        json.imagenes.forEach((img) => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-3';

            const card = document.createElement('div');
            card.className = 'card h-100';

            const imgContainer = document.createElement('img');
            imgContainer.src = img.ruta;
            imgContainer.className = 'card-img-top';
            imgContainer.alt = img.nombre;
            imgContainer.style.height = '150px';
            imgContainer.style.objectFit = 'cover';

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body p-2';

            const name = document.createElement('p');
            name.className = 'card-text small mb-0';
            name.textContent = img.nombre;

            const info = document.createElement('p');
            info.className = 'card-text small text-muted';
            info.textContent = `${img.tipo} · ${(img.tamano / 1024).toFixed(0)}KB`;

            cardBody.appendChild(name);
            cardBody.appendChild(info);

            card.appendChild(imgContainer);
            card.appendChild(cardBody);

            col.appendChild(card);
            galleryContainer.appendChild(col);
        });
    } catch (err) {
        console.error('Error al cargar galería', err);
    }
}

// Cargar galería al abrir la página
document.addEventListener('DOMContentLoaded', loadGallery);