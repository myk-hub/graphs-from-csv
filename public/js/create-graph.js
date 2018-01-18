// parsing data
function parseData(createGraph) {
	Papa.parse("../data/session_history.csv", {
		download: true,
		complete: (results) => createGraph(results.data)
	});
}

function createGraph(data) {
// init basic datas
	let created_at = [];
	let summary_status = [];
	let duration = [];

	for (let i = 1; i < data.length; i++) { // get our data into arrays from data object
		created_at.unshift(data[i][2]);
		summary_status.unshift(data[i][3]);
		duration.unshift(data[i][4]);
	}

	for (let i = 1; i < duration.length; i++) { // round our duration
		duration[i] = Math.ceil(duration[i]);
	}

//***//
	// this arrays needs to find abnormal points
		let formatedCreated_at = [];
		let datesWithoutRepeat = [];
		let indexRepeats = [];
		let countedStatus = [];


		for (let i = 0; i < created_at.length; i++) { // copy arr from main arr
			formatedCreated_at.push(created_at[i]);
		}

		for (let i = 1; i < formatedCreated_at.length; i++) { //parse date to %Y-%m-%d
			formatedCreated_at[i] = formatedCreated_at[i].substr(0, 10);
		}

		let sumOfFails = 0;

		//it is necessary to describe the graphs
		formatedCreated_at[0] = 'Sorted Time';
		datesWithoutRepeat[0] = 'Sorted Time';
		countedStatus[0] = 'Amount of fails';

		for (let i = 0; i < formatedCreated_at.length; i++) {
		  if (datesWithoutRepeat.indexOf(formatedCreated_at[i]) === -1) {
		    datesWithoutRepeat.push(formatedCreated_at[i]);
		    indexRepeats.push(i);
		  }
		}

		for (let i = 0; i < indexRepeats.length; i++) {
		  let counter = 0;
		  for (let j = indexRepeats[i]; j < indexRepeats[i + 1]; j++) {
		    if (summary_status[j] === 'failed') {
		      counter++;
		    }
		  }
		  countedStatus.push(counter);
			sumOfFails += counter;
		}

		let avarage = Math.ceil(sumOfFails / countedStatus.length);
		//
//***//

	for (let i = 1; i < created_at.length; i++) {
		created_at[i] = created_at[i].substr(0, 18);
	}

		for (let i = 1; i < summary_status.length; i++) {
			if (summary_status[i] === 'passed') {
				summary_status[i] = 1;
			} else if (summary_status[i] === 'stopped'){
				summary_status[i] = 0;
			} else if (summary_status[i] === 'error'){
				summary_status[i] = -1;
			} else {
				summary_status[i] = -2;
			}
		}

	summary_status[0] = 'Summary status';
	duration[0] = 'Duration';
	created_at[0] = 'Time';

//Here we build our data
	let sumStatusVsCreatTime = c3.generate({
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

		let failsStat = c3.generate({
			bindto: '#failsStat',
			data: {
					x: 'Sorted Time',
					xFormat: '%Y-%m-%d',
					columns: [
						datesWithoutRepeat,
						countedStatus
					],
					color(color, d) {
						if (d.value > 1) {
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
									format: '%m-%d',
									culling: {
											max: 18
									}
							}
					},
			},
			grid: {
			y: {
					lines: [
							{value: avarage, text: 'abnormal points above this line', position: 'middle'}
					]
				}
			},
			zoom: {
					enabled: true
			}
		});

		let durVsCreatTime = c3.generate({
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
