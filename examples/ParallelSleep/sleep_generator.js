////////////////////////////////////////////////////////////////////////////////////
//
//  Creates example fork-sleep-join workflow of DAG type.
//
//             fork
//
//           /   |   \
//
//        sleep sleep sleep ...
//
//           \   |   /
//
//              fork
//
//
//
//////////////////////////////////////////////////////////////////////////////////////


var
  argv = require('optimist').argv;


// convert number to string with leading zeros, e.g. 0001, 0002, etc.
function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

// create task object
function task(name, hflowFuncionName, executable, args, ins, outs) {
  return {
    "name": name,
    "function": hflowFuncionName,
    "type": "dataflow",
    "firingLimit": 1,
    "config": {
      "executor": {
        "executable": executable,
        "args": args
      },
      "name": name
    },
    "ins": ins,
    "outs": outs
  }
}

function createWf(hflowFuncionName, steps, functionName) {

  var wfOut = {
    processes: [],
    signals: [],
    ins: [0],
    outs: [2*steps+1]
  };

  // create fork task
  var outs = [];
  for (i=1; i<=steps; i++) { outs.push(i); }

  wfOut.processes.push(
    task("fork", hflowFuncionName, functionName, ["Starting parallel sleeps", steps], [0], outs)
  );

  //create sleep tasks
  for (i=0; i<steps; i++) {
    wfOut.processes.push(
      task("sleep" + i, hflowFuncionName, functionName, [i+1, steps], [i+1], [i+steps+1])
    );
  }

  //create join task
  var ins = [];
  for (i=1; i<=steps; i++) { ins.push(steps+i); }

  wfOut.processes.push(
    task("join", hflowFuncionName, functionName, ["join complete", steps], ins, [2*steps+1])
  );

  // create data array with file names
  var signals = []
  signals.push("0");
  signals = signals.concat(outs);
  signals = signals.concat(ins);
  signals.push(2*steps+1)

  wfOut.signals.push({name: signals[0], data: [signals[0]]});
  for (i=1; i<signals.length; i++) {
    wfOut.signals.push({name: signals[i]});
  }


  // output workflow json to stdout
  console.log(JSON.stringify(wfOut, null, 2));

}

if (!argv._[0] || !argv._[1]) {
  console.log("Usage: node sleep_generator.js steps functionName");
  process.exit();
}


createWf("gcfCommand", argv._[0], argv._[1]);