// static/js/main.js

function showToast(title, message, type) {
    const toastId = `toast${Date.now()}`;
    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
            <div class="toast-header">
                <strong class="mr-auto">${title}</strong>
                <small class="text-muted">Maintenant</small>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Fermer">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    $('#toastContainer').append(toastHTML);
    $(`#${toastId}`).toast('show').on('hidden.bs.toast', function () {
        $(this).remove();
    });

    // Modifier le style en fonction du type (success, danger, info, etc.)
    if (type) {
        $(`#${toastId} .toast-header`).addClass(`bg-${type} text-white`);
    }
}
