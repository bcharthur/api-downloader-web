@echo off
REM Démarre l'application Python app.py avec l'environnement virtuel

REM Naviguer vers le répertoire du script batch
cd /d "%~dp0"

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

REM Vérifier si l'activation a réussi
IF "%ERRORLEVEL%" NEQ "0" (
    echo.
    echo Erreur: Impossible d'activer l'environnement virtuel.
    pause
    exit /b %ERRORLEVEL%
)

REM Démarrer l'application Python
python app.py

REM Désactiver l'environnement virtuel après l'arrêt de l'application
deactivate

REM Pause pour voir les messages de sortie
pause
