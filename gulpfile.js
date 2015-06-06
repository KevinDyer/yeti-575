(function() {
  var gulp = require('gulp');
  var nodemon = require('gulp-nodemon');
  var jshint = require('gulp-jshint');
  var mocha = require('gulp-mocha');

  gulp.task('lint-backend', function() {
    return gulp.src('backend/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  });

  gulp.task('lint-test', function() {
    return gulp.src('test/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
  });

  gulp.task('lint', ['lint-backend', 'lint-test']);

  gulp.task('test', ['lint-test'], function() {
    return gulp.src('test/**/*.js')
    .pipe(mocha());
  });

  gulp.task('watch', function() {
    gulp.watch('backend/**/*.js', ['lint-backend', 'test']);
    gulp.watch('test/**/*.js', ['test']);
  });

  gulp.task('backend', function() {
    nodemon({
      script: 'backend/app.js',
      ext: 'js',
      env: {
        NODE_ENV: 'development'
      }
    })
    .on('start', ['lint'], function() {
      console.log('*** Start ***');
    });
  });

  gulp.task('default', ['lint', 'test', 'watch']);
}());