var chai = require('chai');
chai.use(require('chai-fs'));
var expect = chai.expect

var execute = require('../');

describe('execute', function() {
  it('should exist', function() {
    expect(execute).to.exist;
  });

  it('should return a function', function() {
    expect(execute()).to.be.a('function');
  });

  it('should return a function that returns a promise', function() {
    expect(execute()().then).to.exist;
  });

  it('should return an options object handed through it', function(done) {
    var options = {
      key: 'val'
    }
    execute()(options).then(function(opts) {
      if (opts) {
        expect(opts).to.equal(options);
        done();
      } else {
        done(new Error('Expected options to be resolved'));
      }
    }, function() {
      done(new Error('Expected function to resolve, not reject.'));
    });
  });

  describe('shell commands', function() {
    it('should execute a string as a shell script', function(done) {
      //Test by creating file and asserting that it exists
      execute({
        shell: 'echo "new file content" >> ./test/file.txt'
      })().then(function(){
        expect("./test/file.txt").to.be.a.file("file.txt not found")
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })

      //Remove file and asserting that it does not exist
      execute({
        shell: 'rm ./test/file.txt'
      })().then(function(){
        expect("./test/file.txt").not.to.be.a.file("file.txt not found")
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })
    });
  });

  describe('bash scripts', function() {
    it('should execute a file as a bash script', function(done) {
      //Test by creating file and asserting that it exists
      execute({
        bashScript: './test/test-script'
      })().then(function(){
        expect("./test/file.txt").to.be.a.file("file.txt not found")
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })

      //Remove file and asserting that it does not exist
      execute({
        shell: 'rm ./test/file.txt'
      })().then(function(){
        expect("./test/file.txt").not.to.be.a.file("file.txt not found")
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      });
    });

    it('should hand parameters to bash scripts', function(done) {
      //Test by creating file and asserting that it exists
      execute({
        bashScript: './test/test-script-params',
        bashParams: ['./test/file.txt']
      })().then(function(){
        expect("./test/file.txt").to.be.a.file("file.txt not found")
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })

      //Remove file and asserting that it does not exist
      execute({
        shell: 'rm ./test/file.txt'
      })().then(function(){
        expect("./test/file.txt").not.to.be.a.file("file.txt not found")
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })
    });
  });

  xdescribe('logging', function() {

    //TODO: enforce this: these two log tests could be enforced with an abstracted log func and a spy....
    it('should default logging to false', function() {
      execute({
        shell: 'echo "i should not log"'
      })().then(function(){
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })
    });

    //TODO: enforce this
    it('should allow toggling logging', function() {
      execute({
        logOutput: true,
        shell: 'echo "i should log"'
      })().then(function(){
        done()
      }, function() {
        done(new Error('expected function to resolve, not reject'));
      })
    });
  });

});
