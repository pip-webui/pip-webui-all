var 
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    minifyJs = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    sourceMaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    replace = require('gulp-replace'),
    addsrc = require('gulp-add-src'),
    es = require('event-stream'),
    del = require('del'),
    pkg = require('./package.json');

gulp.task('build-js-dev', function() {
    return gulp.src([
            './node_modules/pip-webui-core/dist/pip-webui-core.js',
            './node_modules/pip-webui-rest/dist/pip-webui-rest.js',
            './node_modules/pip-webui-layouts/dist/pip-webui-layouts.js',
            './node_modules/pip-webui-controls/dist/pip-webui-controls.js',
            './node_modules/pip-webui-nav/dist/pip-webui-nav.js',
            './node_modules/pip-webui-locations/dist/pip-webui-locations.js',
            './node_modules/pip-webui-documents/dist/pip-webui-documents.js',
            './node_modules/pip-webui-pictures/dist/pip-webui-pictures.js',
            './node_modules/pip-webui-composite/dist/pip-webui-composite.js',
            './node_modules/pip-webui-entry/dist/pip-webui-entry.js',
            './node_modules/pip-webui-errors/dist/pip-webui-errors.js',
            './node_modules/pip-webui-settings/dist/pip-webui-settings.js',
            './node_modules/pip-webui-guidance/dist/pip-webui-guidance.js',
            './node_modules/pip-webui-help/dist/pip-webui-help.js',
            './node_modules/pip-webui-support/dist/pip-webui-support.js'
        ])
        .pipe(sourceMaps.init({ loadMaps: true }))
        .pipe(concat(pkg.name + '.js'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-js-prod', function() {
    return gulp.src([
            './node_modules/pip-webui-core/dist/pip-webui-core.min.js',
            './node_modules/pip-webui-rest/dist/pip-webui-rest.min.js',
            './node_modules/pip-webui-layouts/dist/pip-webui-layouts.min.js',
            './node_modules/pip-webui-controls/dist/pip-webui-controls.min.js',
            './node_modules/pip-webui-nav/dist/pip-webui-nav.min.js',
            './node_modules/pip-webui-locations/dist/pip-webui-locations.min.js',
            './node_modules/pip-webui-documents/dist/pip-webui-documents.min.js',
            './node_modules/pip-webui-pictures/dist/pip-webui-pictures.min.js',
            './node_modules/pip-webui-composite/dist/pip-webui-composite.min.js',
            './node_modules/pip-webui-entry/dist/pip-webui-entry.min.js',
            './node_modules/pip-webui-errors/dist/pip-webui-errors.min.js',
            './node_modules/pip-webui-settings/dist/pip-webui-settings.min.js',
            './node_modules/pip-webui-guidance/dist/pip-webui-guidance.min.js',
            './node_modules/pip-webui-help/dist/pip-webui-help.min.js',
            './node_modules/pip-webui-support/dist/pip-webui-support.min.js'
        ])
        //.pipe(sourceMaps.init({ loadMaps: true }))
        .pipe(concat(pkg.name + '.min.js'))
        //.pipe(minifyJs())
        //.pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-css-dev', function() {
    return gulp.src([
            './node_modules/pip-webui-css/dist/pip-webui-css.css',
            './node_modules/pip-webui-layouts/dist/pip-webui-layouts.css',
            './node_modules/pip-webui-controls/dist/pip-webui-controls.css',
            './node_modules/pip-webui-nav/dist/pip-webui-nav.css',
            './node_modules/pip-webui-locations/dist/pip-webui-locations.css',
            './node_modules/pip-webui-documents/dist/pip-webui-documents.css',
            './node_modules/pip-webui-pictures/dist/pip-webui-pictures.css',
            './node_modules/pip-webui-composite/dist/pip-webui-composite.css',
            './node_modules/pip-webui-entry/dist/pip-webui-entry.css',
            './node_modules/pip-webui-errors/dist/pip-webui-errors.css',
            './node_modules/pip-webui-settings/dist/pip-webui-settings.css',
            './node_modules/pip-webui-guidance/dist/pip-webui-guidance.css',
            './node_modules/pip-webui-help/dist/pip-webui-help.css',
            './node_modules/pip-webui-support/dist/pip-webui-support.css'
        ])
        .pipe(concat(pkg.name + '.css'))
        .pipe(gulp.dest('./dist')); 
});

gulp.task('build-css-prod', function() {
    return gulp.src([
            './node_modules/pip-webui-css/dist/pip-webui-css.min.css',
            './node_modules/pip-webui-layouts/dist/pip-webui-layouts.min.css',
            './node_modules/pip-webui-controls/dist/pip-webui-controls.min.css',
            './node_modules/pip-webui-nav/dist/pip-webui-nav.min.css',
            './node_modules/pip-webui-locations/dist/pip-webui-locations.min.css',
            './node_modules/pip-webui-documents/dist/pip-webui-documents.min.css',
            './node_modules/pip-webui-pictures/dist/pip-webui-pictures.min.css',
            './node_modules/pip-webui-composite/dist/pip-webui-composite.min.css',
            './node_modules/pip-webui-entry/dist/pip-webui-entry.min.css',
            './node_modules/pip-webui-errors/dist/pip-webui-errors.min.css',
            './node_modules/pip-webui-settings/dist/pip-webui-settings.min.css',
            './node_modules/pip-webui-guidance/dist/pip-webui-guidance.min.css',
            './node_modules/pip-webui-help/dist/pip-webui-help.min.css',
            './node_modules/pip-webui-support/dist/pip-webui-support.min.css'
        ])
        .pipe(concat(pkg.name + '.min.css'))
        .pipe(gulp.dest('./dist')); 
});

gulp.task('build-less', function() {
    return gulp.src([
            './node_modules/pip-webui-css/dist/pip-webui-css.less'
        ])
        .pipe(concat(pkg.name + '.less'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-dev', ['build-js-dev', 'build-css-dev', 'build-less']);
gulp.task('build-prod', ['build-js-prod', 'build-css-prod']);

gulp.task('copy-images', function() {
    return gulp.src([
            './node_modules/pip-webui-css/dist/images/*',
            './node_modules/pip-webui-controls/dist/images/*',
            './node_modules/pip-webui-nav/dist/images/*',
            './node_modules/pip-webui-locations/dist/images/*',
            './node_modules/pip-webui-documents/dist/images/*',
            './node_modules/pip-webui-pictures/dist/images/*',
            './node_modules/pip-webui-composite/dist/images/*',
            './node_modules/pip-webui-entry/dist/images/*',
            './node_modules/pip-webui-errors/dist/images/*',
            './node_modules/pip-webui-settings/dist/images/*',
            './node_modules/pip-webui-guidance/dist/images/*',
            './node_modules/pip-webui-help/dist/images/*',
            './node_modules/pip-webui-support/dist/images/*'
        ])
        .pipe(gulp.dest('./dist/images')); 
});

gulp.task('copy-lib', function() {
    return gulp.src([
            './node_modules/pip-webui-lib/dist/**/*'
        ])
        .pipe(gulp.dest('./dist')); 
});

gulp.task('copy', ['copy-images', 'copy-lib']);

gulp.task('clean', function() {
    del(['./build', './dist']); 
});

gulp.task('build', ['build-dev', 'build-prod', 'copy']);
gulp.task('default', ['build']);