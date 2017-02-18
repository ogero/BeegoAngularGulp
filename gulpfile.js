// Include gulp
const gulp = require('gulp');
var argv = require('yargs').argv;
var plugins = require('gulp-load-plugins')();
var isProduction = (argv.production !== undefined);

var paths = {
	entryScript: 'static/app/index.js',
	sassEntryScript: 'static/css/app.scss',
	dest: 'static/assets'
};

// Concatenate & Minify APP JS
gulp.task('scripts', function () {
	var pipe = gulp.src(paths.entryScript)
			.pipe(plugins.resolveDependencies({
				pattern: /\* @require [\s-]*(.*?\.js)/g
			}));
	if (isProduction) pipe.pipe(plugins.uglify());
	return pipe.pipe(plugins.concat('app.bundle.js'))
			.pipe(gulp.dest(paths.dest));
});

// Concatenate & Minify Vendor JS
gulp.task('vendor-scripts', function () {
	var pipe = gulp.src(paths.entryScript)
			.pipe(plugins.resolveDependencies({
				pattern: /\* @require-vendor [\s-]*(.*?\.js)/g
			}));
	if (isProduction) pipe.pipe(plugins.uglify());
	return pipe.pipe(plugins.concat('vendor.bundle.js'))
			.pipe(gulp.dest(paths.dest));
});

gulp.task('sass', function () {
	var pipe = gulp.src(paths.sassEntryScript)
			.pipe(plugins.sass({outputStyle: isProduction ? 'compressed' : 'nested'}));
	return pipe.pipe(plugins.rename('app.bundle.css')).pipe(gulp.dest(paths.dest));

});

gulp.task('default', ['vendor-scripts', 'scripts', 'sass']);
