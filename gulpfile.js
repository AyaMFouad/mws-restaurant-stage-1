var gulp = require('gulp');
var htmlclean = require('gulp-htmlclean');
var cleancss = require('gulp-clean-css');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var gzip = require('gulp-gzip');
var compression = require('compression')
var uglify = require('gulp-uglify-es').default;
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var imageminWebp = require('imagemin-webp');


gulp.task('copy-idb', function() {
	return gulp.src('js/idb.js')
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-dbhelper', function() {
	return gulp.src('js/dbhelper.js')
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-manifest', function() {
	return gulp.src('./manifest.json')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-html', function() {
	return gulp.src('./*.html')
		.pipe(htmlclean())
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-sw', function() {
	return gulp.src('./sw.js')
		.pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	return gulp.src('img/*')
		.pipe(imagemin([imageminWebp({progressive: true})]))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('copy-resp-images', function() {
	return gulp.src('img_responsive/*')
		.pipe(imagemin([imageminWebp({progressive: true})]))
		.pipe(gulp.dest('dist/img_responsive'));
});

gulp.task('copy-icons', function() {
	return gulp.src('icons/*')
		.pipe(imagemin([imagemin.jpegtran({progressive: true})]))
		.pipe(gulp.dest('dist/icons'));
});

gulp.task('styles', function() {
	return gulp.src('css/**/*.css')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(cleancss())
		.pipe(sourcemaps.write())
		.pipe(gzip())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('scripts-index', function() {
	return gulp.src(['js/dbhelper.js', 'js/main.js', 'js/registerServiceWorker.js'])
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all_index.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gzip())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-restaurant', function() {
	return gulp.src(['js/dbhelper.js', 'js/form.js', 'js/restaurant_info.js' , 'js/registerServiceWorker.js'])
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all_restaurant.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gzip())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist-index', function() {
	return gulp.src(['js/dbhelper.js', 'js/main.js', 'js/registerServiceWorker.js'])
		//.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all_index.js'))
		.pipe(uglify())
		.pipe(gzip())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist-restaurant', function() {
	return gulp.src(['js/dbhelper.js', 'js/form.js', 'js/restaurant_info.js' , 'js/registerServiceWorker.js'])
		//.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(concat('all_restaurant.js'))
		.pipe(uglify())
		.pipe(gzip())
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js'));
});


gulp.task('default', gulp.series(gulp.parallel('copy-manifest', 'copy-html', 'copy-images','copy-resp-images', 'copy-icons', 'copy-sw', 'copy-idb','copy-dbhelper', 'styles', 'scripts-index', 'scripts-restaurant'), function() {
	gulp.watch('css/**/*.css').on('all', gulp.parallel('styles'));
	gulp.watch('./*.html').on('all', gulp.parallel('copy-html'));
	gulp.watch('./sw.js').on('all', gulp.parallel('copy-sw'));
	gulp.watch('./dist/*.html').on('change', browserSync.reload);

	browserSync.init({
		server: {
			baseDir: './dist',
	      middleware: (request, response, next) => compression()(request, response, next)
			},
		// Open the site in Chrome
		browser: "Chrome",
		port: 8000
	});
}));

gulp.task('dist', gulp.parallel(
	'copy-manifest',
	'copy-html',
	'copy-images',
	'copy-resp-images',
	'copy-icons',
	'copy-sw',
	'copy-idb',
	'copy-dbhelper',
	'styles',
	'scripts-dist-index',
	'scripts-dist-restaurant'
));
