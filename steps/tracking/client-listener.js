var kue = require('kue');

//Same queue as we use in the worker
var queue = kue.createQueue({
  "prefix": "q","redis": {
    "host": "192.168.59.103"
  }
});

//cleanup jobs, which are finished before client started
kue.Job.rangeByState('complete', 0, 1000, 'asc', function( err, jobs ) {
  jobs.forEach( function( job ) {
    job.remove( function(){
      console.log('File "%s" downloaded.', job.data.url);
      console.log( 'removed ', job.id );
    });
  });
});

queue.on('job progress', function(id, progress){
  kue.Job.get(id, function(err, job){
    console.log('file "%s" %d%% complete', job.data.url, progress);
  });
}).on('job complete', function(id, result){
  kue.Job.get(id, function(err, job){
    console.log('File "%s" downloaded.', job.data.url);
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
});
