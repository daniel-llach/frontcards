// Load Gulp
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify');
  plumber = require('gulp-plumber');
  less = require('gulp-less');
  cssmin = require('gulp-cssmin');
  babel = require('gulp-babel');

// Minify Custom JS: Run manually with: "gulp build-js"
gulp.task('build-js', function() {
  return gulp.src(['component/landingcards.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('landingcards_es5.js'))
    .pipe(uglify())
    .pipe(gulp.dest('component'));
});
//
// // Minify Custom libs: Run manually with: "gulp build-libs"
// gulp.task('build-libs', function() {
//   return gulp.src(['public/assets/libs/jquery/dist/jquery.min.js',
//   'public/assets/libs/jquery-ui/jquery-ui.min.js',
//     'public/assets/libs/Scrollify/jquery.scrollify.min.js',
//     'public/assets/libs/underscore/underscore-min.js',
//     'public/assets/libs/interact/dist/interact.min.js'
//       ],
//       {base: 'public/assets/libs/'})
//       .pipe(concat('libs.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('public/dist'));
// });
//
// // Minify Custom ie libs
// gulp.task('build-ie', function() {
//   return gulp.src(['public/assets/libs/respond/dest/respond.min.js',
//   'public/assets/libs/selectivizr/selectivizr.js',
//   'public/assets/libs/html5shiv/dist/html5shiv.min.js'],
//   {base: 'public/assets/libs/'})
//     .pipe(concat('libs-ie.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('public/dist'));
// });
//
// // Less to CSS: Run manually with: "gulp build-css"
// gulp.task('build-css', function() {
//     return gulp.src(['public/css/*.less',
//     'public/assets/libs/menumobile/component/menumobile.less'])
//         .pipe(plumber())
//         .pipe(less())
//         .pipe(cssmin())
//         .pipe(concat('allmin.css'))
//         .pipe(gulp.dest('public/dist'));
// });

// Default task
gulp.task('watch', function() {
    // gulp.watch('public/css/**/*.less', ['build-css']);
    gulp.watch('component/*.js', ['build-js']);  //es6
});


// Default Task
gulp.task('default', ['build-js']);
// gulp.task('default', ['build-js', 'build-libs', 'build-ie', 'build-css']);
