// var request = require('request');
var request = require('requestretry');
var executor_config = require('./gcfCommand.config.js');
var identity = function (e) {
  return e
};


function gcfCommand(ins, outs, config, cb) {

  var executable = config.executor.executable
  var jobMessage = {
    name: config.executor.args[0],
    experiment: config.executor.args[1],
    memoryLimitInMB: config.executor.executable.substring(8)
  };

  console.log("Executing:  " + JSON.stringify(jobMessage))

  // var url = executor_config.gcf_url + config.executor.executable
  var url = 'https://hyperflow-executor.azurewebsites.net/api/HttpTriggerJS1?code=IL1E99zTvQxmYqY32UNVXXl3MsImkchXGKYUayR/AzmB94FTyrC4eA=='
  console.log(url)

  if (config.name != "fork" && config.name != "join") {
    t = new Date();
    var req = request.post(
      {
        timeout: 300000,
        url: url,
        json: jobMessage,
        headers: {'Content-Type': 'application/json', 'Accept': '*/*'}
      });

    req.on('error', function (err) {
      console.log("Function: " + executable + " error: " + err);
      cb(err, outs);
    })

    req.on('response', function (response) {
      console.log(new Date() - t)
      console.log("Function: " + config.executor.args[1] + " " + config.executor.executable.substring(8) + " " + config.name + " response status code: " + response.statusCode)
      console.log(new Date())
    })

    req.on('data', function (body) {
      console.log("Function: " + executable + " data: " + body.toString())
    })

    req.on('end', function (body) {
      console.log("Function: " + executable + " end.");
      cb(null, outs);
    })
  } else if(config.name == "join") {
    process.exit(0);
  } else {
    cb(null, outs);
  }
}


exports.gcfCommand = gcfCommand;
