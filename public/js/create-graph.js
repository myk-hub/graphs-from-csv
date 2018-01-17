function parseData(createGraph) {
	Papa.parse("../data/session_history.csv", {
		download: true,
		complete: (results) => {
			createGraph(results.data);
		}
	});
}

function createGraph(data) {

	let created_at = [];
	let summary_status = [];
	let duration = [];

	for (let i = 1; i < data.length; i++) {
		created_at.push(data[i][2]);
		summary_status.push(data[i][3]);
		duration.push(data[i][4]);
	}

	for (let i = 0; i < summary_status.length -1; i++) {
		if (summary_status[i] === 'passed') {
			summary_status[i] = 1;
		} else if (summary_status[i] === 'error'){
			summary_status[i] = 0;
		} else {
			summary_status[i] = -1;
		}
	}

	for (let i = 0; i < duration.length - 1; i++) {
		duration[i] = Math.ceil(duration[i]);
	}

	for (let i = 0; i < created_at.length - 1; i++) {
		created_at[i] = created_at[i].substr(0, 18);
	}

	duration.reverse();
	summary_status.reverse();
	created_at.reverse();

	summary_status[0] = 'Summary status';
	duration[0] = 'Duration';
	created_at[0] = 'Time';

	console.log(duration);
	console.log(created_at);
	console.log(summary_status);

		let summaryStatusVsCreatedTime = c3.generate({
			bindto: '#chart1',
		    data: {
		        columns: [
							summary_status
		        ]
		    },
		    axis: {
		        x: {
		            type: 'spline',
		            categories: created_at,
		            tick: {
		            	multiline: false,
	                	culling: {
	                    	max: 25
	                	}
	            	}
		        }
		    },
		    zoom: {
	        	enabled: true
	    	}
		});

		let duratuinVsCreatedTime = c3.generate({
			bindto: '#chart2',
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

		let test = c3.generate({
			bindto: '#test',
			data: {
	        x: 'Time',
					xFormat: '%Y-%m-%d %H:%M:%S',
	        columns: [
						created_at,
						summary_status
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
	        },
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
