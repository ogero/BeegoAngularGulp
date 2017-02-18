/**
 * This file is used by GULP to pack everything in a single JS file (and minify on production)
 * NOTE: When a new folder is added under this file path, bee must be relaunched, so the watcher can
 * correctly bind to the new folder.
 *
 * @require-vendor ../../node_modules/jquery/dist/jquery.js
 * @require-vendor ../../node_modules/materialize-css/bin/materialize.js
 * @require-vendor ../../node_modules/angular/angular.js
 * @require-vendor ../../node_modules/angular-route/angular-route.js
 * @require-vendor ../../node_modules/ngstorage/ngStorage.js
 * @require-vendor ../../node_modules/angular-ui-router/release/angular-ui-router.js
 * @require-vendor ../../node_modules/angular-materialize/src/angular-materialize.js
 * @require libs/log.js
 * @require app.js
 * @require services/api-service.js
 * @require auth/auth.js
 * @require auth/login/login.js
 * @require admin/admin.js
 * @require admin/dashboard/dashboard.js
 * @require admin/stuff/stuff.js
 */