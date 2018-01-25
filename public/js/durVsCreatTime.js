// parsing data
function parseData(createGraph) {
  Papa.parse("../upload/session_history.csv", {
    download: true,
    complete: (results) => createGraph(results.data)
  });
}

function createGraph(data) {
  // init basic datas from CSV which we need to build charts
  let created_at = [];
  let duration = [];
  // get our data into arrays from data object
  for (let i = 1; i < data.length; i++) {
    created_at.unshift(data[i][2]);
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
  // it is necessary to describe the charts
  duration[0] = 'Duration';
  created_at[0] = 'Time';

  //Here we build our charts
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
          fit: false,
          rotate: 25,
          format: '%Y-%m-%d',
        }
      }
    },
    zoom: {
      enabled: true,
      rescale: true
    },
    subchart: {
      show: true
    }
  });

}

parseData(createGraph);
