//var request = require('request');
var request = require('requestretry');
var executor_config = require('./awsLambdaCommand.config.js');
var identity = function (e) {
  return e
};

function awsLambdaCommand (ins, outs, config, cb) {

  var options = executor_config.options;
  if (config.executor.hasOwnProperty('options')) {
    var executorOptions = config.executor.options;
    for (var opt in executorOptions) {
      if (executorOptions.hasOwnProperty(opt)) {
        options[opt] = executorOptions[opt];
      }
    }
  }
  var executable = config.executor.executable;
  var jobMessage = {
    "executable": executable,
    "args": config.executor.args,
    "env": (config.executor.env || {}),
    "inputs": ins.map(identity),
    "outputs": outs.map(identity),
    "options": options
  };

  console.log("Executing:  " + JSON.stringify(jobMessage));

  var url = executor_config.aws_lambda_url;

  // TODO CHANGE TO AWS LAMBDA API

  var req = request.post(
    {timeout: 60000, url: url, json: jobMessage, headers: {'Content-Type': 'application/json', 'Accept': '*/*'}});

  req.on('error', function (err) {
    console.log("Function: " + executable + " error: " + err);
    cb(err, outs);
  });

  req.on('response', function (response) {
    console.log("Function: " + executable + " response status code: " + response.statusCode)
    console.log('The number of request attempts: ' + response.attempts);
  });

  req.on('data', function (body) {
    console.log("Function: " + executable + " data: " + body.toString())
  });

  req.on('end', function (body) {
    console.log("Function: " + executable + " end.");
    cb(null, outs);
  })

};

exports.awsLambdaCommand = awsLambdaCommand;

