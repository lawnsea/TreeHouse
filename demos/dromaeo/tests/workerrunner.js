(function () {
    var queue = [];
    var results = [];

	// Populated from: http://www.medcalc.be/manual/t-distribution.php
	// 95% confidence for N - 1 = 4
	var tDistribution = 2.776;
	
	// The number of individual test iterations to do
	var numTests = 10;
	
	// The type of run that we're doing (options are "runs/s" or "ms")
	var runStyle = "runs/s";
	
	// A rough estimate, in seconds, of how long it'll take each test
	// iteration to run
	var timePerTest = runStyle === "runs/s" ? 1 : 0.5;

	// Initialize a batch of tests
	//  name = The name of the test collection
	this.startTest = function(name, version){
        console.log('Starting test', name);

		testName = name;
		testID = testName;
		testVersion = version || 0;
		testSummary = testSummaryNum = testDone = testNum = 0;

		queue.push(function(){
			summary = 0;
			dequeue();
		});
	};

	// Anything that you want to have run in order, but not actually test
	this.prep = function(fn){
		queue.push(function(){
			fn();
			dequeue();
		});
	};

	// End the tests and finalize the report
	this.endTest = function(){
        console.log('Ending test', testName);
        postMessage(testName);
		// Save the summary output until all the test are complete
		queue.push(function(){
			dequeue();
		});
	};

	// Run a new test
	//  name = The unique name of the test
	//  num = The 'length' of the test (length of string, # of tests, etc.)
	//  fn = A function holding the test to run
	this.test = function(name, num, fn){
		// Save the summary output until all the test are complete
		var curTest = testName;

		if ( arguments.length === 3 ) {
            // XXX: WTF does this shit do
			if ( !nameDone[name] )
				nameDone[name] = 0;
			nameDone[name]++;
	
			if ( nameDone[name] != 3 )
				return; 
		} else {
			fn = num;
			num = 1;
		}

		testNum++;

		// Don't execute the test immediately
		queue.push(function(){
			title = name;
			var times = [], start, pos = 0, cur;
			
			setTimeout(function(){
				// run tests
				try {
                    console.warn('Trial', pos + 1, 'of', numTests);
					start = (new Date()).getTime();
					
					if ( runStyle === "runs/s" ) {
						var runs = 0;
						
						cur = (new Date()).getTime();
						
						while ( (cur - start) < 1000 ) {
							fn();
							cur = (new Date()).getTime();
							runs++;
						}
					} else {
						fn();
						cur = (new Date()).getTime();
					}
					
					// For making Median and Variance
					if ( runStyle === "runs/s" ) {
						times.push( (runs * 1000) / (cur - start) );
					} else {
						times.push( cur - start );
					}
				} catch( e ) {
					console.error("FAIL " + name + " " + num + e);
                    // let's run all the tests
					//return;
				}

				if ( ++pos < numTests ) {
					setTimeout( arguments.callee, 1 );
				
				} else {
					var data = compute( times, numTests );

					data.collection = testName;
					data.version = testVersion;
					data.name = title;
					data.scale = num;
                    data.raw = times.slice();
								
					logTest(data);
			
					dequeue();
				}
			}, 1);
		});

		function compute(times, runs){
			var results = {runs: runs}, num = times.length;

			times = times.sort(function(a,b){
				return a - b;
			});

			// Make Sum
			results.sum = 0;

			for ( var i = 0; i < num; i++ )
				results.sum += times[i];

			// Make Min
			results.min = times[0];
					  
			// Make Max
			results.max = times[ num - 1 ];

			// Make Mean
			results.mean = results.sum / num;
			
			// Make Median
			results.median = num % 2 == 0 ?
				(times[Math.floor(num/2)] + times[Math.ceil(num/2)]) / 2 :
				times[Math.round(num/2)];
			
			// Make Variance
			results.variance = 0;

			for ( var i = 0; i < num; i++ )
				results.variance += Math.pow(times[i] - results.mean, 2);

			results.variance /= num - 1;
					
			// Make Standard Deviation
			results.deviation = Math.sqrt( results.variance );

			// Compute Standard Errors Mean
			results.sem = (results.deviation / Math.sqrt(results.runs)) * tDistribution;

			// Error
			results.error = ((results.sem / results.mean) * 100) || 0;

			return results;
		}
	};
	
	function logTest(data){
        results.push(data);
	}

	// Remove the next test from the queue and execute it
    var testCount = 0, testIndex = 0;
	function dequeue(){
		if (queue.length) {
            testIndex++;
            console.warn(testName, 'step', testIndex, 'of', testCount);
			queue.shift()();
		} else {
            self.postMessage(results);
        }
	}

    this.startEm = function () {
        dequeue();
    }

    self.addEventListener('message', function (event) {
        if (event.data === 'startEm') {
            testCount = queue.length;
            dequeue();
        }
    }, false);
}());
