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
            '../pip-webui-core/dist/pip-webui-core.js',
            '../pip-webui-rest/dist/pip-webui-rest.js',
            '../pip-webui-test/dist/pip-webui-test.js',
            '../pip-webui-layouts/dist/pip-webui-layouts.js',
            '../pip-webui-controls/dist/pip-webui-controls.js',
            '../pip-webui-nav/dist/pip-webui-nav.js',
            '../pip-webui-locations/dist/pip-webui-locations.js',
            '../pip-webui-documents/dist/pip-webui-documents.js',
            '../pip-webui-pictures/dist/pip-webui-pictures.js',
            '../pip-webui-composite/dist/pip-webui-composite.js',
            '../pip-webui-entry/dist/pip-webui-entry.js',
            '../pip-webui-errors/dist/pip-webui-errors.js',
            '../pip-webui-settings/dist/pip-webui-settings.js',
            '../pip-webui-guidance/dist/pip-webui-guidance.js',
            '../pip-webui-help/dist/pip-webui-help.js',
            '../pip-webui-support/dist/pip-webui-support.js'
        ])
        .pipe(sourceMaps.init({ loadMaps: true }))
        .pipe(concat(pkg.name + '.js'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-js-prod', function() {
    return gulp.src([
            '../pip-webui-core/dist/pip-webui-core.min.js',
            '../pip-webui-rest/dist/pip-webui-rest.min.js',
            '../pip-webui-test/dist/pip-webui-test.min.js',
            '../pip-webui-layouts/dist/pip-webui-layouts.min.js',
            '../pip-webui-controls/dist/pip-webui-controls.min.js',
            '../pip-webui-nav/dist/pip-webui-nav.min.js',
            '../pip-webui-locations/dist/pip-webui-locations.min.js',
            '../pip-webui-documents/dist/pip-webui-documents.min.js',
            '../pip-webui-pictures/dist/pip-webui-pictures.min.js',
            '../pip-webui-composite/dist/pip-webui-composite.min.js',
            '../pip-webui-entry/dist/pip-webui-entry.min.js',
            '../pip-webui-errors/dist/pip-webui-errors.min.js',
            '../pip-webui-settings/dist/pip-webui-settings.min.js',
            '../pip-webui-guidance/dist/pip-webui-guidance.min.js',
            '../pip-webui-help/dist/pip-webui-help.min.js',
            '../pip-webui-support/dist/pip-webui-support.min.js'
        ])
        //.pipe(sourceMaps.init({ loadMaps: true }))
        .pipe(concat(pkg.name + '.min.js'))
        //.pipe(minifyJs())
        //.pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-css-dev', function() {
    return gulp.src([
            '../pip-webui-css/dist/pip-webui-css.css',
            '../pip-webui-layouts/dist/pip-webui-layouts.css',
            '../pip-webui-controls/dist/pip-webui-controls.css',
            '../pip-webui-nav/dist/pip-webui-nav.css',
            '../pip-webui-locations/dist/pip-webui-locations.css',
            '../pip-webui-documents/dist/pip-webui-documents.css',
            '../pip-webui-pictures/dist/pip-webui-pictures.css',
            '../pip-webui-composite/dist/pip-webui-composite.css',
            '../pip-webui-entry/dist/pip-webui-entry.css',
            '../pip-webui-errors/dist/pip-webui-errors.css',
            '../pip-webui-settings/dist/pip-webui-settings.css',
            '../pip-webui-guidance/dist/pip-webui-guidance.css',
            '../pip-webui-help/dist/pip-webui-help.css',
            '../pip-webui-support/dist/pip-webui-support.css'
        ])
        .pipe(concat(pkg.name + '.css'))
        .pipe(gulp.dest('./dist')); 
});

gulp.task('build-css-prod', function() {
    return gulp.src([
            '../pip-webui-css/dist/pip-webui-css.min.css',
            '../pip-webui-layouts/dist/pip-webui-layouts.min.css',
            '../pip-webui-controls/dist/pip-webui-controls.min.css',
            '../pip-webui-nav/dist/pip-webui-nav.min.css',
            '../pip-webui-locations/dist/pip-webui-locations.min.css',
            '../pip-webui-documents/dist/pip-webui-documents.min.css',
            '../pip-webui-pictures/dist/pip-webui-pictures.min.css',
            '../pip-webui-composite/dist/pip-webui-composite.min.css',
            '../pip-webui-entry/dist/pip-webui-entry.min.css',
            '../pip-webui-errors/dist/pip-webui-errors.min.css',
            '../pip-webui-settings/dist/pip-webui-settings.min.css',
            '../pip-webui-guidance/dist/pip-webui-guidance.min.css',
            '../pip-webui-help/dist/pip-webui-help.min.css',
            '../pip-webui-support/dist/pip-webui-support.min.css'
        ])
        .pipe(concat(pkg.name + '.min.css'))
        .pipe(gulp.dest('./dist')); 
});

gulp.task('build-less', function() {
    return gulp.src([
            '../pip-webui-css/dist/pip-webui-css.less'
        ])
        .pipe(concat(pkg.name + '.less'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-dev', ['build-js-dev', 'build-css-dev', 'build-less']);
gulp.task('build-prod', ['build-js-prod', 'build-css-prod']);

gulp.task('copy-images', function() {
    return gulp.src([
            '../pip-webui-controls/dist/images/*',
            '../pip-webui-nav/dist/images/*',
            '../pip-webui-locations/dist/images/*',
            '../pip-webui-documents/dist/images/*',
            '../pip-webui-pictures/dist/images/*',
            '../pip-webui-composite/dist/images/*',
            '../pip-webui-entry/dist/images/*',
            '../pip-webui-errors/dist/images/*',
            '../pip-webui-settings/dist/images/*',
            '../pip-webui-guidance/dist/images/*',
            '../pip-webui-help/dist/images/*',
            '../pip-webui-support/dist/images/*',
            '../pip-webui-css/dist/images/*'
        ])
        .pipe(gulp.dest('./dist/images')); 
});

gulp.task('copy-lib', function() {
    return gulp.src([
            '../pip-webui-lib/dist/**/*'
        ])
        .pipe(gulp.dest('./dist')); 
});

gulp.task('copy', ['copy-images', 'copy-lib']);

gulp.task('clean', function() {
    del(['./build', './dist']); 
});

gulp.task('build', ['build-dev', 'build-prod', 'copy']);
gulp.task('default', ['build']);