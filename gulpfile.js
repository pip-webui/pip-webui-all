var
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    minifyJs = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    sourceMaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace'),
    addsrc = require('gulp-add-src'),
    es = require('event-stream'),
    del = require('del');

gulp.task('build-js-dev', function () {
    return gulp.src([
        '../pip-webui-core/dist/pip-webui-core.js',
        '../pip-webui-layouts/dist/pip-webui-layouts.js',
        '../pip-webui-split/dist/pip-webui-split.js',
        '../pip-webui-controls/dist/pip-webui-controls.js',
        '../pip-webui-lists/dist/pip-webui-lists.js',
        '../pip-webui-dates/dist/pip-webui-dates.js',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.js',
        '../pip-webui-nav/dist/pip-webui-nav.js',
        '../pip-webui-themes/dist/pip-webui-themes.js',
        '../pip-webui-errors/dist/pip-webui-errors.js',
        '../pip-webui-charts/dist/pip-webui-charts.js'
    ])
        .pipe(sourceMaps.init({loadMaps: true}))
        .pipe(concat('pip-webui.js'))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-js-prod', function () {
    return gulp.src([
        '../pip-webui-core/dist/pip-webui-core.min.js',
        '../pip-webui-layouts/dist/pip-webui-layouts.min.js',
        '../pip-webui-split/dist/pip-webui-split.min.js',
        '../pip-webui-controls/dist/pip-webui-controls.min.js',
        '../pip-webui-lists/dist/pip-webui-lists.min.js',
        '../pip-webui-dates/dist/pip-webui-dates.min.js',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.min.js',
        '../pip-webui-nav/dist/pip-webui-nav.min.js',
        '../pip-webui-themes/dist/pip-webui-themes.min.js',
        '../pip-webui-errors/dist/pip-webui-errors.min.js',
        '../pip-webui-charts/dist/pip-webui-charts.min.js'
    ])
    //.pipe(sourceMaps.init({ loadMaps: true }))
    .pipe(concat('pip-webui.min.js'))
    //.pipe(minifyJs())
    //.pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-css-dev', function () {
    return gulp.src([
        '../pip-webui-css/dist/pip-webui-css.css',
        '../pip-webui-csscomponents/dist/pip-webui-csscomponents.css',
        '../pip-webui-core/dist/pip-webui-core.css',
        '../pip-webui-layouts/dist/pip-webui-layouts.css',
        '../pip-webui-split/dist/pip-webui-split.css',
        '../pip-webui-controls/dist/pip-webui-controls.css',
        '../pip-webui-lists/dist/pip-webui-lists.css',
        '../pip-webui-dates/dist/pip-webui-dates.css',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.css',
        '../pip-webui-nav/dist/pip-webui-nav.css',
        '../pip-webui-themes/dist/pip-webui-themes.css',
        '../pip-webui-errors/dist/pip-webui-errors.css',
        '../pip-webui-charts/dist/pip-webui-charts.css'

    ])
        .pipe(concat('pip-webui.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-css-prod', function () {
    return gulp.src([
        '../pip-webui-css/dist/pip-webui-css.min.css',
        '../pip-webui-csscomponents/dist/pip-webui-csscomponents.min.css',
        '../pip-webui-core/dist/pip-webui-core.min.css',
        '../pip-webui-layouts/dist/pip-webui-layouts.min.css',
        '../pip-webui-split/dist/pip-webui-split.min.css',
        '../pip-webui-controls/dist/pip-webui-controls.min.css',
        '../pip-webui-lists/dist/pip-webui-lists.min.css',
        '../pip-webui-dates/dist/pip-webui-dates.min.css',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.min.css',
        '../pip-webui-nav/dist/pip-webui-nav.min.css',
        '../pip-webui-themes/dist/pip-webui-themes.min.css',
        '../pip-webui-errors/dist/pip-webui-errors.min.css',
        '../pip-webui-charts/dist/pip-webui-charts.min.css'
    ])
    .pipe(concat('pip-webui.min.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-less', function () {
    return gulp.src([
        '../pip-webui-css/dist/pip-webui-css.less'
    ])
    .pipe(concat('pip-webui.less'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-dev', ['build-js-dev', 'build-css-dev', 'build-less']);
gulp.task('build-prod', ['build-js-prod', 'build-css-prod']);

gulp.task('copy-images', function () {
    return gulp.src([
        '../pip-webui-lists/dist/images/*',
        '../pip-webui-controls/dist/images/*',
        '../pip-webui-charts/dist/images/*',
        '../pip-webui-dialogs/dist/images/*',
        '../pip-webui-dates/dist/images/*',
        '../pip-webui-themes/dist/images/*',
        '../pip-webui-nav/dist/images/*',
        '../pip-webui-errors/dist/images/*',
        '../pip-webui-css/dist/images/*',
        '../pip-webui-csscomponents/dist/images/*'
    ])
    .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy-lib', function () {
    return gulp.src([
        '../pip-webui-lib/dist/**/*'
    ])
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy', ['copy-images', 'copy-lib']);

gulp.task('clean', function () {
    del(['./build', './dist']);
});

gulp.task('build', ['build-dev', 'build-prod', 'copy']);
gulp.task('default', ['build']);