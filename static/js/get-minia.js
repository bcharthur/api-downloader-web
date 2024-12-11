// static/js/get-minia.js

$(document).ready(function() {
    let currentThumbnailUrl = '';

    // Gestionnaire pour "Afficher la miniature"
    $('#getThumbnailForm').on('submit', function(e) {
        e.preventDefault();
        const url = $('#thumbnail_url').val();

        // Désactiver le bouton et ajouter le spinner
        $('#getThumbnailBtn').prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Chargement...
        `);

        $.ajax({
            url: '/api/get_thumbnail',
            method: 'GET',
            data: { url: url },
            success: function(response) {
                if (response.thumbnail_url) {
                    currentThumbnailUrl = response.thumbnail_url;
                    $('#resultThumbnail').html(`<img src="${response.thumbnail_url}" alt="Miniature" class="img-thumbnail" style="max-width: 300px;">`);
                } else if (response.error) {
                    showToast('Erreur', response.error, 'danger');
                }
            },
            error: function(xhr) {
                const error = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'Erreur inconnue';
                showToast('Erreur', error, 'danger');
            },
            complete: function() {
                // Rétablir le contenu original du bouton et réactiver le bouton
                $('#getThumbnailBtn').prop('disabled', false).html('Obtenir la miniature');
            }
        });
    });

    // Gestionnaire pour "Télécharger la miniature"
    $('#downloadThumbnailBtn').on('click', function() {
        const url = $('#thumbnail_url').val();

        if (!url) {
            showToast('Erreur', 'Veuillez fournir une URL de vidéo.', 'danger');
            return;
        }

        // Désactiver le bouton et ajouter le spinner
        $('#downloadThumbnailBtn').prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Téléchargement...
        `);

        // Fonction pour déclencher le téléchargement
        const downloadThumbnail = function(thumbnailUrl) {
            // Créer un lien temporaire
            const link = document.createElement('a');
            link.href = thumbnailUrl;
            link.download = ''; // Laisser le navigateur décider du nom du fichier
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Succès', 'Miniature téléchargée avec succès!', 'success');

            // Réactiver le bouton et restaurer le texte
            $('#downloadThumbnailBtn').prop('disabled', false).html('Télécharger la miniature');
        };

        if (currentThumbnailUrl) {
            // Utiliser l'URL de la miniature déjà obtenue
            downloadThumbnail(currentThumbnailUrl);
        } else {
            // Récupérer l'URL de la miniature avant de télécharger
            $.ajax({
                url: '/api/get_thumbnail',
                method: 'GET',
                data: { url: url },
                success: function(response) {
                    if (response.thumbnail_url) {
                        currentThumbnailUrl = response.thumbnail_url;
                        downloadThumbnail(response.thumbnail_url);
                    } else if (response.error) {
                        showToast('Erreur', response.error, 'danger');
                        $('#downloadThumbnailBtn').prop('disabled', false).html('Télécharger la miniature');
                    }
                },
                error: function(xhr) {
                    const error = xhr.responseJSON && xhr.responseJSON.error ? xhr.responseJSON.error : 'Erreur inconnue';
                    showToast('Erreur', error, 'danger');
                    $('#downloadThumbnailBtn').prop('disabled', false).html('Télécharger la miniature');
                }
            });
        }
    });
});
