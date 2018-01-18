// parsing data
function parseData(createGraph) {
  Papa.parse("../data/session_history.csv", {
    download: true,
    complete: (results) => createGraph(results.data)
  });
}

function createGraph(data) {
  // init basic datas from CSV which we need to build charts
  let created_at = [];
  let summary_status = [];
  let duration = [];
  // get our data into arrays from data object
  for (let i = 1; i < data.length; i++) {
    created_at.unshift(data[i][2]);
    summary_status.unshift(data[i][3]);
    duration.unshift(data[i][4]);
  }
  // round our duration
  for (let i = 1; i < duration.length; i++) {
    duration[i] = Math.ceil(duration[i]);
  }
  // date time format to %Y-%m-%d %H:%M:%S
  for (let i = 1; i < created_at.length; i++) {
    created_at[i] = created_at[i].substr(0, 18);
  }
  // c3.js doesn't support the string as ordinates,
  // so I convert the values into a convenient format
  for (let i = 1; i < summary_status.length; i++) {
    if (summary_status[i] === 'passed') {
      summary_status[i] = 1;
    } else if (summary_status[i] === 'stopped') {
      summary_status[i] = 0;
    } else if (summary_status[i] === 'error') {
      summary_status[i] = -1;
    } else {
      summary_status[i] = -2;
    }
  }
  // it is necessary to describe the charts
  summary_status[0] = 'Summary status';
  duration[0] = 'Duration';
  created_at[0] = 'Time';
	
  //Here we build our charts
  const sumStatusVsCreatTime = c3.generate({
    bindto: '#statusVsTime',
    data: {
      x: 'Time',
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [
        created_at,
        summary_status
      ],
      color(color, d) {
        if (d.value === 1) {
          return "#7bbb36";
        } else if (d.value === -1) {
          return "#ffe03d";
        } else if (d.value === -2) {
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
          format: '%m-%d %H:%M',
          culling: {
            max: 5
          }
        }
      },
    },
    zoom: {
      enabled: true
    },
    subchart: {
      show: true
    }
  });

  const durVsCreatTime = c3.generate({
    bindto: '#durVsTime',
    data: {
      x: 'Time',
      xFormat: '%Y-%m-%d %H:%M:%S',
      columns: [
        created_at,
        duration
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%m-%d %H:%M',
          culling: {
            max: 5
          }
        }
      }
    },
    zoom: {
      enabled: true
    },
    subchart: {
      show: true
    }
  });

}

parseData(createGraph);
