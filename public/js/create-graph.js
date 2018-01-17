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

	console.log(duration);
	console.log(created_at);
	console.log(summary_status);

	var chart = c3.generate({
		bindto: '#chart',
	    data: {
	        columns: [
	        	created_at
	        ]
	    },
	    axis: {
	        x: {
	            type: 'bar',
	            categories: created_at,
	            tick: {
	            	multiline: false,
                	culling: {
                    	max: 15
                	}
            	}
	        }
	    },
	    zoom: {
        	enabled: true
    	},
	    legend: {
	        position: 'right'
	    }
	});
}

parseData(createGraph);
