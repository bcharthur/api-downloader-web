// static/js/get-info.js

document.addEventListener('DOMContentLoaded', function() {
    const getTitleForm = document.getElementById('getTitleForm');
    const getTitleBtn = document.getElementById('getTitleBtn'); // Ajout de l'ID pour le bouton
    const resultTitleDiv = document.getElementById('resultTitle');

    if (!getTitleForm || !getTitleBtn || !resultTitleDiv) {
        console.error("Les éléments du formulaire d'obtention du titre ne sont pas trouvés.");
        return;
    }

    getTitleForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        const url = document.getElementById('title_url').value.trim();
        if (!url) {
            showToast('Erreur', 'Veuillez entrer une URL web valide.', 'danger');
            return;
        }

        // Désactiver le bouton et ajouter le spinner
        getTitleBtn.disabled = true;
        const originalBtnContent = getTitleBtn.innerHTML;
        getTitleBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Chargement...
        `;

        const encodedURL = encodeURIComponent(url);
        console.log(`Encoded URL for get-title: ${encodedURL}`);

        fetch(`/api/get-title?ytb_url=${encodedURL}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    resultTitleDiv.innerHTML = `<div class="alert alert-success" role="alert"><strong>Titre:</strong> ${data.title}</div>`;
                } else {
                    resultTitleDiv.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Erreur:</strong> ${data.message}</div>`;
                }
            })
            .catch(err => {
                console.error('Erreur lors de la récupération du titre:', err);
                resultTitleDiv.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Erreur:</strong> ${err.message || err}</div>`;
            })
            .finally(() => {
                // Rétablir le contenu original du bouton et réactiver le bouton
                getTitleBtn.disabled = false;
                getTitleBtn.innerHTML = originalBtnContent;
            });
    });
});
