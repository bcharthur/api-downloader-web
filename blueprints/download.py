# blueprints/download.py

from flask import Blueprint, request, jsonify, send_from_directory, current_app, url_for
from flask_cors import cross_origin
import logging
import yt_dlp
import os
import glob

download_bp = Blueprint('download_bp', __name__)

@download_bp.route('/api/download', methods=['GET'])
@cross_origin(origins="*")  # Autorise toutes les origines pour le développement
def download_video():
    ytb_url = request.args.get('ytb_url')
    logging.info(f"[DOWNLOAD] Requête reçue avec ytb_url={ytb_url}")

    if not ytb_url:
        logging.warning("[DOWNLOAD] Paramètre 'ytb_url' manquant.")
        return jsonify({'status': 'error', 'message': 'Paramètre ytb_url manquant.'}), 400

    try:
        downloads_dir = os.path.join(current_app.root_path, 'downloads')
        if not os.path.exists(downloads_dir):
            os.makedirs(downloads_dir)
            logging.info(f"[DOWNLOAD] Dossier 'downloads' créé à {downloads_dir}")

        # Supprimer tous les fichiers .mp4 existants dans le dossier downloads
        deleted_files = 0
        for file in glob.glob(os.path.join(downloads_dir, '*.mp4')):
            try:
                os.remove(file)
                logging.info(f"[DOWNLOAD] Supprimé le fichier existant: {file}")
                deleted_files += 1
            except Exception as e:
                logging.error(f"[DOWNLOAD] Erreur lors de la suppression du fichier {file}: {e}")

        logging.info(f"[DOWNLOAD] Nombre de fichiers supprimés: {deleted_files}")

        ydl_opts = {
            'format': 'best[ext=mp4]',
            'outtmpl': os.path.join(downloads_dir, '%(id)s.%(ext)s'),
            'noplaylist': True,
            'quiet': False,  # Activez les logs de yt-dlp pour le débogage
            'no_warnings': True,
            'restrictfilenames': True,  # Assure des noms de fichiers sécurisés
            'overwrite': True,  # Écrase les fichiers existants
        }

        logging.info("[DOWNLOAD] Démarrage du téléchargement avec yt-dlp...")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(ytb_url, download=True)
            download_path = info_dict.get('filepath', None)
            if not download_path:
                video_id = info_dict.get('id', 'video')
                ext = info_dict.get('ext', 'mp4')
                download_path = os.path.join(downloads_dir, f"{video_id}.{ext}")
                logging.info(f"[DOWNLOAD] Vidéo téléchargée avec succès: {download_path}")
            else:
                logging.info(f"[DOWNLOAD] Vidéo téléchargée avec succès: {download_path}")

        # Vérifier si le fichier existe
        if not os.path.exists(download_path):
            logging.error(f"[DOWNLOAD] Le fichier téléchargé n'existe pas: {download_path}")
            return jsonify({'status': 'error', 'message': 'Le fichier téléchargé est introuvable.'}), 500

        # Récupérer le nom du fichier
        filename = os.path.basename(download_path)
        logging.info(f"[DOWNLOAD] Nom du fichier à envoyer: {filename}")

        # Générer l'URL de téléchargement
        download_url = url_for('download_file', filename=filename, _external=True)
        logging.info(f"[DOWNLOAD] URL de téléchargement: {download_url}")

        # Renvoyer l'URL de téléchargement dans la réponse JSON
        return jsonify({'status': 'success', 'download_url': download_url}), 200

    except yt_dlp.utils.DownloadError as e:
        logging.error(f"[DOWNLOAD] yt-dlp Error: {e}")
        return jsonify({'status': 'error', 'message': 'Erreur lors du téléchargement avec yt-dlp.'}), 500
    except Exception as e:
        logging.exception(f"[DOWNLOAD] Erreur lors du téléchargement de la vidéo: {e}")
        return jsonify({'status': 'error', 'message': 'Erreur lors du téléchargement de la vidéo.'}), 500
