# lambduh-execute
Execute any shell string via node.exec

# Usage

Two sample use-cases shown here:

```javascript
var Q = require('q');
var execute = require('lambduh-execute');

//your lambda function
exports.handler = function(event, context) {
  var promises = [];
  
  promises.push(execute({
    shell: "echo `ls /tmp/`",
    showOutput: true
  }) // logs output of /tmp/ dir on your lambda machine
  
  promises.push(execute({
    shell: "cp /var/task/ffmpeg /tmp/.; chmod 755 /tmp/ffmpeg",
    showOutput: true
  }) // copies an ffmpeg binary to /tmp/ and chmods permissions to run it
  
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

This module takes a `script` object that can have two fields: a `shell` field for writing a string of unix commands to be executed, and a `showOutput` boolean for showing the stdout and stderr logs.

`showOutput` defaults to false.

The tests in this repo could use enforcement around `showOutput` - I'm onto bigger fish for now, will hopefully get back to it.
