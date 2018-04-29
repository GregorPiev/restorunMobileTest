'use strict';

// Load all gulp plugins automatically
// and attach them to the `plugins` object
const plugins = require('gulp-load-plugins')();

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355

const pkg = require('./package.json');
const dirs = pkg.configs.directories;

const runSequence = require('run-sequence');
const merge = require('gulp-merge-json');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const templateCache = require('gulp-angular-templatecache');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs-extra');

const gulp = require('gulp');
const gutil = require('gulp-util');
const browserify = require('browserify');
const sourcemaps = require('gulp-sourcemaps');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const plumber = require('gulp-plumber');
const compass = require('gulp-compass');
const notify = require('gulp-notify');
const size = require('gulp-size');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const revDel = require('rev-del');
const concatCss = require('gulp-concat-css');

var argv = require('yargs').argv;
var gulpif = require('gulp-if');

const connect = require('gulp-connect');
const browserSync = require('browser-sync').create();
const historyApiFallback = require('connect-history-api-fallback');
const modRewrite = require('connect-modrewrite');
const es = require('event-stream');

// ---------------------------------------------------------------------
// tasks
// ---------------------------------------------------------------------

gulp.task('copy-build', () => {
    return gulp.src([
        // Copy all files
        dirs.src + '/css/stylesheets/**/*',
        dirs.src + '/css/fonts/**/*',
        dirs.src + '/js/build/app.js',
        dirs.src + '/views/*',
        dirs.src + '/index.html'
    ], {
        // Include hidden files by default
        dot: true,
        base: 'src'
    }).pipe(gulp.dest(dirs.dist));
});

gulp.task('copy-img-build', () => {
    return gulp.src([dirs.src + '/images/**/*'], {
            dot: true,
            base: 'src'
        })
        .pipe(imagemin({ optimizationLevel: 7, progressive: true }))
        .pipe(gulp.dest(dirs.dist));
});

const jschint = (files) => {
    return gulp.src(files)
        .pipe(plugins.jscs())
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
};

gulp.task('lint:js:app', () => {
    return jschint([
        dirs.src + '/js/**/*.js', '!' + dirs.src + '/js/build/**/*'
    ]);
});

gulp.task('lint:js:gulp', () => {
    return jschint(['gulpfile.js']);
});

// compass task
gulp.task('sass', () => {
    return gulp.src(dirs.src + '/css/sass/*.scss')
        .pipe(plumber({
            errorHandler: (error) => {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(compass({
            config_file: dirs.src + '/css/config.rb',
            css: dirs.src + '/css/stylesheets',
            sass: dirs.src + '/css/sass',
            comments: true
        }))
        .on('error', (error) => {
            // Would like to catch the error here
            console.log(error);
        })
        .pipe(gulpif(argv.production, cleanCSS({ compatibility: 'ie9' })))
        .pipe(size({
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(dirs.src + '/css/stylesheets'))
        .pipe(browserSync.stream());
});

gulp.task('clean-dist', () => {
    return fs.emptyDir(dirs.dist);
});

gulp.task('scripts', () => {
    const files = [
        dirs.src + '/js/app.js',
        dirs.src + '/js/templates.js'
    ];

    const tasks = files.map((file) => {
        const name = file.substr(file.lastIndexOf('/') + 1);

        return browserify({
                entries: [file],
                debug: true,
                insertGlobals: true
            })
            .bundle()
            .pipe(source(name))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .pipe(gulpif(argv.production, uglify()))
            .pipe(size({
                gzip: true,
                showFiles: true
            }))
            .pipe(gulp.dest(dirs.src + '/js/build'));
    });

    // create a merged stream
    return es.merge.apply(null, tasks);
});

gulp.task('dist-templatecache', () => {
    return gulp.src(dirs.src + '/views/**/*')
        .pipe(templateCache({
            root: 'views/'
        }))
        .pipe(gulp.dest(dirs.dist + '/js/build'));
});

gulp.task('rev_files', () => {
    return gulp.src([dirs.dist + '/images/**/*', dirs.dist + '/js/build/**/*', dirs.dist + '/css/**/*'], { base: dirs.dist })
        //Change file names
        .pipe(rev())
        //Save them to the assets directory
        .pipe(gulp.dest(dirs.dist))
        //Prepare the manifest file
        .pipe(rev.manifest())
        //Delete unused files
        .pipe(revDel())
        //Save the manifest file to the dist directory
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('rev_html_replace', () => {
    return gulp.src([dirs.dist + '/index.html'])
        .pipe(revReplace({
            manifest: gulp.src(dirs.dist + '/rev-manifest.json')
        }))
        .pipe(gulp.dest(dirs.dist));
});

gulp.task('watch', ['dev'], () => {
    // Whenever a stylesheet is changed, recompile
    gulp.watch(dirs.src + '/css/sass/**', ['sass']);
    gulp.watch([dirs.src + '/js/**/*.js', '!' + dirs.src + '/js/build/**/*'], ['lint:js:app', 'scripts']);
    gulp.watch(['gulpfile.js'], ['lint:js:gulp']);
});

gulp.task('build', (done) => {
    argv.production = true;
    runSequence(
        ['clean-dist', 'sass', 'scripts'], ['dist-templatecache', 'copy-build', 'copy-img-build'], ['rev_files'], ['rev_html_replace'],
        done);
});

gulp.task('dev', (done) => {
    runSequence(['sass', 'scripts'], done);
});

gulp.task('serve', ['watch'], () => {
    browserSync.init({
        server: {
            baseDir: ['src'],
            middleware: [
                modRewrite([
                    '^/api/(.*)$ http://mobile.restorun.co.il/api/$1 [P]'
                ]),
                historyApiFallback()
            ]
        },
        port: 5520,
        host: 'localhost'
    });
});

gulp.task('serve-dist', [], () => {

    browserSync.init({
        server: {
            baseDir: ['dist'],
            middleware: [
                modRewrite([
                    '^/api/(.*)$ http://mobile.restorun.co.il/api/$1 [P]'
                ]),
                historyApiFallback()
            ]
        },
        port: 5530,
        host: 'localhost'
    });
});
