var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('mocha', function() {
  return gulp.src('test/*.js')
    .pipe(mocha());
});

gulp.task('watch', function() {
  gulp.watch(
    ['*.js', 'test/*.js'],
    ['mocha']
  );
});

gulp.task('default', ['mocha', 'watch']);

