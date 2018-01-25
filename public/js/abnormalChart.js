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
  countedStatus[0] = 'Amount of fails';
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
      if (summary_status[j] === 'failed') {
        counter++;
      }
    }
    countedStatus.push(counter);
  }
  // fix problem with last element
  let lastDayCounter = 0;

  for (let i = indexRepeats[indexRepeats.length - 1]; i < summary_status.length; i++) {
    if (summary_status[i] === 'failed') {
      lastDayCounter++;
    }
  }

  countedStatus.push(lastDayCounter);
  // solution based on interquartile range
  let findAbnormalPoint = function (arr) {
    let q1, q3, iqr, maxValue, minValue,
        values = arr.slice().sort( (a, b) => a - b); //copy array fast and sort

    if((values.length / 4) % 1 === 0){ //find quartiles
      q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
      q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
    } else {
      q1 = values[Math.floor(values.length / 4 + 1)];
      q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
    }

    iqr = q3 - q1;
    maxValue = q3 + iqr * 1.5;
    minValue = q1 - iqr * 1.5;

    return Math.max.apply(null, values.filter((x) => (x >= minValue) && (x <= maxValue)));
  };

  const maxNormalValue = findAbnormalPoint(countedStatus);
  // build abnormal graph
  const failsStat = c3.generate({
    bindto: '#failsStat',
    data: {
      x: 'Sorted Time',
      xFormat: '%Y-%m-%d',
      columns: [
        datesWithoutRepeat,
        countedStatus
      ],
      color(color, d) {
        if (d.value > maxNormalValue) {
          return "#d33642";
        } else {
          return color;
        }
      }
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          culling: {
            max: 30
          },
          rotate: 80,
          format: '%Y-%m-%d'
        }
      },
    },
    grid: {
      y: {
        lines: [{
          value: maxNormalValue,
          text: 'abnormal points above this line',
          position: 'middle'
        }]
      }
    },
    zoom: {
      enabled: true,
      rescale: true
    }
  });

}

parseData(createGraph);
