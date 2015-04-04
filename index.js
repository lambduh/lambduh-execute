var Q = require('q');

var proc = require('child_process');

module.exports = function(result, script) {
  var def = Q.defer();

  if (!script) {
    def.resolve(result);
  } else if (script.shell) {
    console.log('spawning shell');
    console.log(script);
    proc.exec(script.shell, function(error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error);
        //TODO: should this be rejecting the result?
        def.reject(result);
      }

      if (script.logOutput) {
        console.log("exec stdout: " + stdout);
        console.log("exec stderr: " + stderr);
      }

      def.resolve(result);
    });
  } else if (script.bashScript) {

    var child = proc.spawn(script.bashScript, script.bashParams);
    console.log('spawning script');
    console.log(script);
    child.stdout.on('data', function(data) {
      if (script.logOutput) {
        console.log("exec stdout: " + data);
      }
    });
    child.stderr.on('data', function(data) {
      if (script.logOutput) {
        console.log("exec stderr: " + data);
      }
    });
    child.on('exit', function(code) {
      if (code != 0) {
        def.reject(new Error('error running bash script'));
      } else {
        def.resolve(result)
      }
    });

  } else {
    //odd to do this first and last.
    def.resolve(result);
  }

  return def.promise;
}
