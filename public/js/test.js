let formatedCreated_at = ['2014-08-11',
									'2014-08-11',
									'2014-08-12',
									'2014-08-12',
									'2014-08-13',
									'2014-08-13',
									'2014-08-13',
									'2014-08-13',
									'2014-08-13',
									'2014-08-14',
									'2014-08-14',
									'2014-08-14',
									'2014-08-15',
									'2014-08-17',
									'2014-08-17',
									'2014-08-17',
									'2014-08-17',
									'2014-08-17',
									'2014-08-17',
									'2014-08-17',
									'2014-08-17',
									'2014-08-18',
									'2014-08-19' ];
let summary_status = ["passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed", "passed", "failed", "passed", "error", "stopped", "passed", "failed", "passed", "passed", "failed", "passed", "passed"];

let datesWithoutRepeat = [];
let indexRepeats = [];
let countedStatus = [];

for (let i = 0; i < formatedCreated_at.length; i++) {
  if (datesWithoutRepeat.indexOf(formatedCreated_at[i]) === -1) {
    datesWithoutRepeat.push(formatedCreated_at[i]);
    indexRepeats.push(i);
  }
}

for (let i = 0; i < indexRepeats.length; i++) {
  let counter = 0;
  for (let j = indexRepeats[i]; j < indexRepeats[i + 1]; j++) { // FIXME: last item
    if (summary_status[j] === 'failed') {
      counter++;
    }
  }
  countedStatus.push(counter);
}

console.log(datesWithoutRepeat);
console.log(countedStatus);
console.log(indexRepeats);
