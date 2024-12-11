// static/js/download.js

document.addEventListener('DOMContentLoaded', function() {
    const downloadForm = document.getElementById('downloadForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const resultDownloadDiv = document.getElementById('resultDownload');

    if (!downloadForm || !downloadBtn || !resultDownloadDiv) {
        console.error("Les éléments du formulaire de téléchargement ne sont pas trouvés.");
        return;
    }

    console.log("download.js est chargé et prêt.");

    downloadForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Empêche le rechargement de la page
        console.log("Formulaire de téléchargement soumis.");

        const ytbUrl = document.getElementById('ytb_url').value.trim();
        console.log(`URL entrée: ${ytbUrl}`);

        if (!ytbUrl) {
            resultDownloadDiv.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Erreur:</strong> Veuillez entrer une URL valide.</div>`;
            console.warn("URL non valide.");
            return;
        }

        // Afficher le message de téléchargement en cours
        resultDownloadDiv.innerHTML = `<div class="alert alert-info" role="alert">Téléchargement en cours...</div>`;
        console.log("Message de téléchargement en cours affiché.");

        // Désactiver le bouton et ajouter le spinner
        downloadBtn.disabled = true;
        const originalBtnContent = downloadBtn.innerHTML; // Sauvegarder le contenu original
        console.log("Désactivation du bouton et ajout du spinner.");

        downloadBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Téléchargement...
        `;

        try {
            const response = await fetch(`/api/download?ytb_url=${encodeURIComponent(ytbUrl)}`, {
                method: 'GET',
                mode: 'cors', // Assure que CORS est utilisé
            });

            console.log('Réponse reçue:', response);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors du téléchargement.');
            }

            const data = await response.json();
            console.log('Données reçues:', data);

            if (data.status === 'success' && data.download_url) {
                // Créer un lien de téléchargement
                const downloadLink = document.createElement('a');
                downloadLink.href = data.download_url;
                downloadLink.textContent = 'Télécharger la vidéo';
                downloadLink.className = 'btn btn-success mt-3';
                downloadLink.target = '_blank'; // Ouvre dans un nouvel onglet

                // Vider la div et ajouter le lien
                resultDownloadDiv.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        Téléchargement terminé. Cliquez sur le lien ci-dessous pour télécharger la vidéo.
                    </div>
                `;
                resultDownloadDiv.appendChild(downloadLink);
                console.log('Lien de téléchargement affiché.');
            } else {
                throw new Error(data.message || 'Erreur lors du téléchargement.');
            }
        } catch (err) {
            console.error('Erreur lors du téléchargement:', err);
            resultDownloadDiv.innerHTML = `<div class="alert alert-danger" role="alert"><strong>Erreur:</strong> ${err.message}</div>`;
        } finally {
            // Rétablir le contenu original du bouton et réactiver le bouton
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalBtnContent;
            console.log("Bouton réactivé et contenu original restauré.");
        }
    });
});
