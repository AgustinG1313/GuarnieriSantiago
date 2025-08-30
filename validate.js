async function validateArtworks() {
    console.log('Iniciando validación de artworks.json...');

    try {
        const response = await fetch('artworks.json');
        if (!response.ok) {
            console.error('Error: No se pudo cargar artworks.json. Estado:', response.status);
            return;
        }
        const artworks = await response.json();
        const artworkIds = Object.keys(artworks);

        const requiredFields = ['title', 'description', 'materials', 'technique', 'history', 'images'];
        let errorCount = 0;
        const errorLog = {};

        console.log(`Se encontraron ${artworkIds.length} obras. Validando campos requeridos: ${requiredFields.join(', ')}...`);

        artworkIds.forEach(id => {
            const artwork = artworks[id];
            const errors = [];

            requiredFields.forEach(field => {
                if (!artwork.hasOwnProperty(field)) {
                    errors.push(`Falta el campo requerido: '${field}'.`);
                } else if (typeof artwork[field] === 'string' && artwork[field].trim() === '') {
                    errors.push(`El campo '${field}' está vacío.`);
                } else if (Array.isArray(artwork[field]) && artwork[field].length === 0) {
                    errors.push(`El arreglo de imágenes '${field}' está vacío.`);
                }
            });
            
            // Validaciones específicas para campos con descripciones genéricas
            if (artwork.description && artwork.description.toLowerCase().includes('descripción de la obra')) {
                errors.push(`El campo 'description' tiene contenido genérico.`);
            }
            if (artwork.materials && artwork.materials.toLowerCase().includes('materiales de la obra')) {
                errors.push(`El campo 'materials' tiene contenido genérico.`);
            }
            if (artwork.technique && artwork.technique.toLowerCase().includes('técnica utilizada')) {
                errors.push(`El campo 'technique' tiene contenido genérico.`);
            }
            if (artwork.history && artwork.history.toLowerCase().includes('historia de la obra')) {
                errors.push(`El campo 'history' tiene contenido genérico.`);
            }

            if (errors.length > 0) {
                errorCount += errors.length;
                errorLog[id] = errors;
            }
        });

        if (errorCount === 0) {
            console.log('%c¡Validación completada! Todos las obras pasaron la prueba.', 'color: #4CAF50; font-weight: bold;');
        } else {
            console.warn(`%cValidación completada con ${errorCount} errores en ${Object.keys(errorLog).length} obras.`, 'color: #FFC107; font-weight: bold;');
            console.log('--- Reporte de Errores ---');
            for (const id in errorLog) {
                console.groupCollapsed(`Obra: ${id}`);
                errorLog[id].forEach(error => console.error(`- ${error}`));
                console.groupEnd();
            }
            console.log('--- Fin del Reporte ---');
        }

    } catch (error) {
        console.error('Ocurrió un error inesperado durante la validación:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const validateButton = document.getElementById('validate-button');
    if (validateButton) {
        validateButton.addEventListener('click', validateArtworks);
    }
});
