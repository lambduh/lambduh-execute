var Q = require('q');

var proc = require('child_process');

module.exports = function(script) {
  return function(options) {
    var def = Q.defer();

    if (!script) {
      //hand options through if no script was handed in
      def.resolve(options);
    } else if (script.shell) {
      proc.exec(script.shell, function(error, stdout, stderr) {
        if (error) {
          console.log("exec error: " + error);
          def.reject(options);
        }

        if (script.logOutput) {
          console.log("exec stdout: " + stdout);
          console.log("exec stderr: " + stderr);
        }

        def.resolve(options);
      });
    } else if (script.bashScript) {

      var child = proc.spawn(script.bashScript, script.bashParams);
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
          def.resolve(options)
        }
      });

    } else {
      //odd to do this first and last.
      def.resolve(options);
    }

    return def.promise;
  }
}
