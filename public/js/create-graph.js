function parseData(createGraph) {
	Papa.parse("../data/session_history.csv", {
		download: true,
		complete: function(results) {
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

	// for (var i = 0; i < created_at.length; i++) {
	// 	created_at[i]
	// }

	for (let i = 0; i < summary_status.length; i++) {
		if (summary_status[i] === 'passed') {
			summary_status[i] = 1;
		} else if (summary_status[i] === 'error'){
			summary_status[i] = 0;
		} else {
			summary_status[i] = -1;
		}
	}

	for (let i = 0; i < duration.length; i++) {
		duration[i] = Math.ceil(duration[i]);
	}

	console.log(duration);
	console.log(created_at[1]);
	console.log(summary_status);

		let chart1 = c3.generate({
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
	                    	max: 100
	                	}
	            	}
		        }
		    },
		    zoom: {
	        	enabled: true
	    	}
		});

		let chart2 = c3.generate({
			bindto: '#chart2',
				data: {
						columns: [
							duration
						]
				},
				axis: {
						x: {
								type: 'bar',
								categories: created_at,
								tick: {
									multiline: false,
										culling: {
												max: 100
										}
								}
						}
				},
				zoom: {
						enabled: true
				}
		});
}

parseData(createGraph);
