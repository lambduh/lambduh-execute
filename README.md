# lambduh-execute
Execute any shell string or bash script from AWS Lambda

# Usage

```javascript
var Q = require('q');
var execute = require('lambduh-execute');

//your lambda function
exports.handler = function(event, context) {
  var promises = [];

  promises.push(execute({
    shell: "echo `ls /tmp/`",
    logOutput: true
  }) // logs output of /tmp/ dir on your lambda machine

  promises.push(execute({
    shell: "cp /var/task/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg",
    logOutput: true
  }) // copies an ffmpeg binary to /tmp/ and chmods permissions to run it

  //if you need data on the options object, wrap and return the promise
  promises.push(function(options) {
    return execute({
      shell: "rm " + options.mp4Path
    })(options);
  }) // pulls in path from options object to fire dynamic script

  //you can also run a bashScript of your choice
  promises.push(function(options) {
    return execute({
      bashScript: "/tmp/path/to/bash"
    })(options);
  })

  //and hand in any parameters you'd like
  promises.push(function(options) {
    return execute({
      bashScript: "/tmp/path/to/bash",
      bashParams: ["filey-namey"]
    })(options);
  })

  promises.push(function(options) {
    context.done()
  })

  promises.reduce(Q.when, Q())
    .fail(function(err) {
      console.log("derp");
      console.log(err);
      context.done(null, err);
    });
}
```

This module takes a `script` object that can have two fields: a `shell` field for writing a string of unix commands to be executed, and a `logOutput` boolean for showing the stdout and stderr logs.

`logOutput` defaults to false.

The tests in this repo could use enforcement around `logOutput` - I'm onto bigger fish for now, will hopefully get back to it.
