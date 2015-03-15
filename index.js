var Q = require('q');

var proc = require('child_process');

module.exports = function(script) {
  return function(options) {
    var def = Q.defer();

    if (!script) {
      //hand options through if no script was handed in
      def.resolve(options);
    } else {
      proc.exec(script.shell, function(error, stdout, stderr) {
        if (error) {
          console.log("exec error: " + error);
        }

        if (script.showOutput) {
          console.log("exec stdout: " + stdout);
          console.log("exec stderr: " + stderr);
        }

        def.resolve(options);
      });
    }

    return def.promise;
  }
}
