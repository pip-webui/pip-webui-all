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

gulp.task('build-ts', function () {
    return gulp.src([
        '../pip-webui-services/dist/pip-webui-services.d.ts',
        '../pip-webui-buttons/dist/pip-webui-buttons.d.ts',
        '../pip-webui-landing/dist/pip-webui-landing.d.ts',
        '../pip-webui-headers/dist/pip-webui-headers.d.ts',
        '../pip-webui-layouts/dist/pip-webui-layouts.d.ts',
        '../pip-webui-split/dist/pip-webui-split.d.ts',
        '../pip-webui-behaviors/dist/pip-webui-behaviors.d.ts',
        '../pip-webui-controls/dist/pip-webui-controls.d.ts',
        '../pip-webui-lists/dist/pip-webui-lists.d.ts',
        '../pip-webui-dates/dist/pip-webui-dates.d.ts',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.d.ts',
        '../pip-webui-nav/dist/pip-webui-nav.d.ts',
        '../pip-webui-themes/dist/pip-webui-themes.d.ts',
        '../pip-webui-errors/dist/pip-webui-errors.d.ts',
        '../pip-webui-charts/dist/pip-webui-charts.d.ts',
        '../pip-webui-locations/dist/pip-webui-locations.d.ts',
        '../pip-webui-files/dist/pip-webui-files.d.ts',
        '../pip-webui-dashboard/dist/pip-webui-dashboard.d.ts',
        '../pip-webui-settings/dist/pip-webui-settings.d.ts',
        '../pip-webui-help/dist/pip-webui-help.d.ts',
    ])
    .pipe(concat('pip-webui.d.ts'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-js-dev', function () {
    return gulp.src([
        '../pip-webui-services/dist/pip-webui-services.js',
        '../pip-webui-buttons/dist/pip-webui-buttons.js',
        '../pip-webui-landing/dist/pip-webui-landing.js',
        '../pip-webui-headers/dist/pip-webui-headers.js',
        '../pip-webui-layouts/dist/pip-webui-layouts.js',
        '../pip-webui-split/dist/pip-webui-split.js',
        '../pip-webui-behaviors/dist/pip-webui-behaviors.js',
        '../pip-webui-controls/dist/pip-webui-controls.js',
        '../pip-webui-lists/dist/pip-webui-lists.js',
        '../pip-webui-dates/dist/pip-webui-dates.js',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.js',
        '../pip-webui-nav/dist/pip-webui-nav.js',
        '../pip-webui-themes/dist/pip-webui-themes.js',
        '../pip-webui-errors/dist/pip-webui-errors.js',
        '../pip-webui-charts/dist/pip-webui-charts.js',
        '../pip-webui-locations/dist/pip-webui-locations.js',
        '../pip-webui-files/dist/pip-webui-files.js',
        '../pip-webui-dashboard/dist/pip-webui-dashboard.js',
        '../pip-webui-settings/dist/pip-webui-settings.js',
        '../pip-webui-help/dist/pip-webui-help.js',
    ])
    .pipe(sourceMaps.init({loadMaps: true}))
    .pipe(concat('pip-webui.js'))
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-js-prod', function () {
    return gulp.src([
        '../pip-webui-services/dist/pip-webui-services.min.js',
        '../pip-webui-buttons/dist/pip-webui-buttons.min.js',
        '../pip-webui-landing/dist/pip-webui-landing.min.js',
        '../pip-webui-headers/dist/pip-webui-headers.min.js',
        '../pip-webui-layouts/dist/pip-webui-layouts.min.js',
        '../pip-webui-split/dist/pip-webui-split.min.js',
        '../pip-webui-behaviors/dist/pip-webui-behaviors.min.js',
        '../pip-webui-controls/dist/pip-webui-controls.min.js',
        '../pip-webui-lists/dist/pip-webui-lists.min.js',
        '../pip-webui-dates/dist/pip-webui-dates.min.js',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.min.js',
        '../pip-webui-nav/dist/pip-webui-nav.min.js',
        '../pip-webui-themes/dist/pip-webui-themes.min.js',
        '../pip-webui-errors/dist/pip-webui-errors.min.js',
        '../pip-webui-charts/dist/pip-webui-charts.min.js',
        '../pip-webui-locations/dist/pip-webui-locations.min.js',
        '../pip-webui-files/dist/pip-webui-files.min.js',
        '../pip-webui-dashboard/dist/pip-webui-dashboard.min.js',
        '../pip-webui-settings/dist/pip-webui-settings.min.js',
        '../pip-webui-help/dist/pip-webui-help.min.js',
    ])
    .pipe(sourceMaps.init({ loadMaps: true }))
    .pipe(concat('pip-webui.min.js'))
    //.pipe(minifyJs())
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-css-dev', function () {
    return gulp.src([
        '../pip-webui-css/dist/pip-webui-css.css',
        '../pip-webui-landing/dist/pip-webui-landing.css',
        '../pip-webui-headers/dist/pip-webui-headers.css',
        '../pip-webui-buttons/dist/pip-webui-buttons.css',
        '../pip-webui-services/dist/pip-webui-services.css',
        '../pip-webui-layouts/dist/pip-webui-layouts.css',
        '../pip-webui-split/dist/pip-webui-split.css',
        '../pip-webui-behaviors/dist/pip-webui-behaviors.css',
        '../pip-webui-controls/dist/pip-webui-controls.css',
        '../pip-webui-lists/dist/pip-webui-lists.css',
        '../pip-webui-dates/dist/pip-webui-dates.css',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.css',
        '../pip-webui-nav/dist/pip-webui-nav.css',
        '../pip-webui-themes/dist/pip-webui-themes.css',
        '../pip-webui-errors/dist/pip-webui-errors.css',
        '../pip-webui-charts/dist/pip-webui-charts.css',
        '../pip-webui-locations/dist/pip-webui-locations.css',
        '../pip-webui-files/dist/pip-webui-files.css',
        '../pip-webui-dashboard/dist/pip-webui-dashboard.css',
        '../pip-webui-settings/dist/pip-webui-settings.css',
        '../pip-webui-help/dist/pip-webui-help.css',
    ])
    .pipe(concat('pip-webui.css'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-css-prod', function () {
    return gulp.src([
        '../pip-webui-css/dist/pip-webui-css.min.css',
        '../pip-webui-landing/dist/pip-webui-landing.min.css',
        '../pip-webui-headers/dist/pip-webui-headers.min.css',
        '../pip-webui-buttons/dist/pip-webui-buttons.min.css',
        '../pip-webui-services/dist/pip-webui-services.min.css',
        '../pip-webui-layouts/dist/pip-webui-layouts.min.css',
        '../pip-webui-split/dist/pip-webui-split.min.css',
        '../pip-webui-behaviors/dist/pip-webui-behaviors.min.css',
        '../pip-webui-controls/dist/pip-webui-controls.min.css',
        '../pip-webui-lists/dist/pip-webui-lists.min.css',
        '../pip-webui-dates/dist/pip-webui-dates.min.css',
        '../pip-webui-dialogs/dist/pip-webui-dialogs.min.css',
        '../pip-webui-nav/dist/pip-webui-nav.min.css',
        '../pip-webui-themes/dist/pip-webui-themes.min.css',
        '../pip-webui-errors/dist/pip-webui-errors.min.css',
        '../pip-webui-charts/dist/pip-webui-charts.min.css',
        '../pip-webui-locations/dist/pip-webui-locations.min.css',
        '../pip-webui-files/dist/pip-webui-files.min.css',
        '../pip-webui-dashboard/dist/pip-webui-dashboard.min.css',
        '../pip-webui-settings/dist/pip-webui-settings.min.css',
        '../pip-webui-help/dist/pip-webui-help.min.css',
    ])
    .pipe(sourceMaps.init({ loadMaps: true }))
    .pipe(concat('pip-webui.min.css'))
    .pipe(sourceMaps.write('.'))
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
        '../pip-webui-behaviors/dist/images/*',
        '../pip-webui-lists/dist/images/*',
        '../pip-webui-controls/dist/images/*',
        '../pip-webui-charts/dist/images/*',
        '../pip-webui-dialogs/dist/images/*',
        '../pip-webui-dates/dist/images/*',
        '../pip-webui-themes/dist/images/*',
        '../pip-webui-nav/dist/images/*',
        '../pip-webui-errors/dist/images/*',
        '../pip-webui-headers/dist/images/*',
        '../pip-webui-buttons/dist/images/*',
        '../pip-webui-landing/dist/images/*',
        '../pip-webui-locations/dist/images/*',
        '../pip-webui-settings/dist/images/*',
        '../pip-webui-files/dist/images/*',
        '../pip-webui-dashboard/dist/images/*',
        '../pip-webui-help/dist/images/*',
        '../pip-webui-css/dist/images/*'
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

gulp.task('build', ['build-dev', 'build-prod', 'build-ts', 'copy']);
gulp.task('rebuild', ['build']);
gulp.task('default', ['build']);