# lambduh-execute
Execute any shell string or bash script from AWS Lambda

# Install

```
npm i --save lambduh-execute
```

# Usage

```javascript
var Q = require('q');
var execute = require('lambduh-execute');

//your lambda function
exports.handler = function(event, context) {

  var result = {}
  execute(result, {
    shell: "echo `ls /tmp/`", // logs output of /tmp/ dir on your lambda machine
    logOutput: true
  })
  .then(function(result) {
    return execute(result, {
      shell: "cp /var/task/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg", // copies an ffmpeg binary to /tmp/ and chmods permissions to run it
      logOutput: true
    })
  })
  .then(function(result) {
    return execute(result, {
      shell: "rm " + result.mp4Path // pulls in path from options object to fire dynamic script
    });
  })
  .then(function(result) {
    return execute(result, {
      bashScript: "/tmp/path/to/bash/script" //you can also run a bash script
    });
  })
  .then(function(result) {
    return execute(result, {
      bashScript: "/tmp/path/to/bash/script",
      bashParams: ["filey-namey"] //and hand in any parameters you'd like
    });
  })
  .then(function(result) {
    context.done()
  })
  .fail(function(err) {
    console.log("derp");
    console.log(err);
    context.done(null, err);
  });
}
```

This module takes a `script` object that can have a few options:

 - a `shell` field for writing a string of unix commands to be executed
 - a `baseScript` field with a path to the bash script to be executed
 - a `baseParams` array with params to be passed to the script
 - a `logOutput` boolean for showing the stdout and stderr logs

`logOutput` defaults to false.

The tests in this repo could use enforcement around `logOutput` - I'm onto bigger fish for now, will hopefully get back to it.
