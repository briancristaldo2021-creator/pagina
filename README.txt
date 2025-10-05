LCDM Full Package (Frontend + API)

Upload workflow:
1) Edit api/config.php with your MySQL credentials.
2) Import api/create_tables.sql into phpMyAdmin.
3) Upload the 'api' folder to /htdocs/api/ (on InfinityFree).
4) Upload 'uploads' folder (empty) with write permission (the api will create it if missing).
5) Upload frontend files (index.html, album.html, muro.html, ranking.html, panel.html, frontend-api.js, codigos.js, manifest.json, img/... ) to /htdocs/
6) Test endpoints as described in README in package.
