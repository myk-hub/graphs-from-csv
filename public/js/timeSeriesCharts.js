// parsing data
function parseData(createGraph) {
  Papa.parse("../upload/session_history.csv", {
    download: true,
    complete: (results) => createGraph(results.data)
  });
}

function createGraph(data) {
  // init basic datas from CSV
  let created_at = [];
  let summary_status = [];
  // we need these arrays to construct graphs with abnormal points
  let datesWithoutRepeat = [];
  // status arrays
  let passedArr = ['passed'];
  let errorArr = ['error'];
  let stoppedArr = ['stopped'];
  let failedArr = ['failed'];
  // auxiliary array for error calculations
  let indexRepeats = [];
  // get our data into arrays from data object
  for (let i = 1; i < data.length; i++) {
    created_at.unshift(data[i][2]);
    summary_status.unshift(data[i][3]);
  }
  // parse date to %Y-%m-%d
  for (let i = 1; i < created_at.length; i++) {
    created_at[i] = created_at[i].substr(0, 10);
  }
  // it is necessary to describe the charts
  created_at[0] = 'Sorted Time';
  datesWithoutRepeat[0] = 'Sorted Time';
  // avoid repeating the same date values and push into another array
  for (let i = 0; i < created_at.length; i++) {
    if (datesWithoutRepeat.indexOf(created_at[i]) === -1) {
      datesWithoutRepeat.push(created_at[i]);
      indexRepeats.push(i); // here we have indexes of uncounted failures
    }
  }
  // count the failures for each separate day
  // here we need our indexRepeats
  for (let i = 0; i < indexRepeats.length - 1; i++) {
    let passedCounter = 0, errorCounter = 0, stoppedCounter = 0, failedCounter = 0;

    for (let j = indexRepeats[i]; j < indexRepeats[i + 1]; j++) {
        if (summary_status[j] === 'passed')  passedCounter++;
        if (summary_status[j] === 'error')  errorCounter++;
        if (summary_status[j] === 'stopped') stoppedCounter++;
        if (summary_status[j] === 'failed') failedCounter++;
    }

    passedArr.push(passedCounter);
    errorArr.push(errorCounter);
    stoppedArr.push(stoppedCounter);
    failedArr.push(failedCounter);
  }
  // fix problem with last element
  let passedLastCounter = 0, errorLastCounter = 0, stoppedLastCounter = 0, failedLastCounter = 0;

  for (let i = indexRepeats[indexRepeats.length - 1]; i < summary_status.length; i++) {
    if (summary_status[i] === 'passed')  passedLastCounter++;
    if (summary_status[i] === 'error') errorLastCounter++;
    if (summary_status[i] === 'stopped') stoppedLastCounter++;
    if (summary_status[i] === 'failed') failedLastCounter++;
  }

  passedArr.push(passedLastCounter);
  errorArr.push(errorLastCounter);
  stoppedArr.push(stoppedLastCounter);
  failedArr.push(failedLastCounter);
  //Here we build our charts
  const sumStatusVsCreatTime = c3.generate({
    bindto: '#statusVsTime',
    data: {
        x: 'Sorted Time',
        type: 'bar',
        columns: [
            datesWithoutRepeat,
            passedArr,
            errorArr,
            stoppedArr,
            failedArr
        ],
        groups: [
          ['passed', 'error', 'stopped', 'failed']
        ],
        order: 'desc'
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                culling: {
                  max: 30
                },
                rotate: 65,
                fit: true,
                format: '%Y-%m-%d'
            }
        }
    },
    zoom: {
      enabled: true,
      rescale: true
    }
  });

}

parseData(createGraph);
