var gulp    		= require('gulp'),
    takana  		= require('takana'),
    sass    		= require('gulp-sass'),
    jade 			= require('gulp-jade'),
    autoprefixer 	= require('gulp-autoprefixer'),
    browserSync 	= require('browser-sync'),
    sourcemaps      = require('gulp-sourcemaps'),
    vueify          = require('vueify'),
    fs              = require('fs'),
    browserify      = require('browserify'),
    gBrowserify     = require('gulp-browserify');


// run takana
gulp.task('takana', function() {
  takana.run({
    path: __dirname
  });
});


// Compile the Sass
gulp.task('sass', function() {
    gulp.src('./vendor/scss/main.scss')
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./vendor/css/unprefixed'))
        .pipe(browserSync.stream());
});


//Autoprefix the outputted css
gulp.task('autoprefix', function() {
	return gulp.src('./css/unprefixed/*.css')
	.pipe(autoprefixer({
		browsers: ['last 10 versions', 'ie 10'],
		cascade: false
	}))
	.pipe(gulp.dest('./dist/css'));
});


Scripts
gulp.task('scripts', function() {
    browserify('./vendor/js/app.js')
        .transform(vueify)
        .bundle()
        .pipe(fs.createWriteStream('./dist/js/app.js'))
});

// gulp.task('scripts', function(){
//     gulp.src('./vendor/js/app.js')
//         .pipe(gBrowserify({
//             transform: ['vueify'],
//             extensions: ['.vue']
//         }))
//         .pipe(gulp.dest('./dist/js'))
// });


// Compile the Jade
gulp.task('jade', function() {
	return gulp.src('./vendor/jade/*.jade')
	.pipe(jade())
	.pipe(gulp.dest('./dist'));
});


// Browser-sync
gulp.task('sync', function() {
    browserSync.init({
        notify: false,
        port: 5000,
        server: {
            baseDir: "./dist"
        }
    });
});


// Reload task
gulp.task('bs-reload', function () {
    browserSync.reload();
});


// Watch
gulp.task('watch', function (){
    gulp.watch(['./dist/js/*.js', './dist/*.html'], ['bs-reload']);
    gulp.watch(['./vendor/scss/**/*.scss', './vendor/scss/**/*.sass', './vendor/scss/*.scss', './vendor/scss/*.sass'], ['sass']);
    gulp.watch(['./vendor/js/*.js'], ['scripts']);
    gulp.watch('./vendor/css/unprefixed/main.css', ['autoprefix']);
    gulp.watch('./vendor/jade/*.jade', ['jade']);
});


gulp.task('default', ['scripts', 'sass', 'watch', 'jade', 'sync', 'takana', 'autoprefix']);
