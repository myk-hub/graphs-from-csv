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
  let countedStatus = [];
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
  countedStatus[0] = 'Amount of builds';
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
    let counter = 0;
    for (let j = indexRepeats[i]; j < indexRepeats[i + 1]; j++) {
        counter++;
    }
    countedStatus.push(counter);
  }
  // fix problem with last element
  let lastDayCounter = 0;
  for (let i = indexRepeats[indexRepeats.length - 1]; i < summary_status.length; i++) {
      lastDayCounter++;
  }
  countedStatus.push(lastDayCounter);
  // countedStatus.pop(1);
  //Here we build our charts
  const sumStatusVsCreatTime = c3.generate({
    bindto: '#statusVsTime',
    data: {
        x: 'Sorted Time',
        type: 'bar',
        columns: [
            datesWithoutRepeat,
            countedStatus,
            summary_status
        ],
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                fit: false,
                format: '%Y-%m-%d'
            }
        }
    },
    zoom: {
      enabled: true,
      rescale: true
    },
    line: {
      size: 10
    }
  });

}

parseData(createGraph);
