(function() {
  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');
  var jshint = require('gulp-jshint');

  gulp.task('default', ['develop'], function() {
  });

  gulp.task('develop', function() {
    nodemon({
      script: 'backend/app.js',
      ext: 'js',
      tasks: ['lint']
    }).on('restart', function() {
      console.log('Restarted!');
    });
  });

  gulp.task('lint', function() {
    gulp.src('./**/*.js')
    .pipe(jshint());
  });

}());