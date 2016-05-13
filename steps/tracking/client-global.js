var kue = require('kue');

//Same queue as we use in the worker
var queue = kue.createQueue({
  "prefix": "q","redis": {
    "host": "127.0.0.1"
  }
});

//as a sample client will create 10 tasks for file download
var filesToDownload = 10;

//counter to know when all jobs complete
var complete = 0;
queue.on('job progress', function(id, progress){
  kue.Job.get(id, function(err, job){
    console.log('file "%s" %d%% complete', job.data.url, progress);
  });
}).on('job complete', function(id, result){
  kue.Job.get(id, function(err, job){
    complete++;
    console.log('File "%s" downloaded.', job.data.url);
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
    if(complete === filesToDownload){
      process.exit(0);
    }
  });
});

function createJob(url){
  var job = queue.create('download', {
    url: url
  }).save();
}

//create 10 download jobs
for(var i=1;i<=filesToDownload;i++){
  createJob('http://example.org/document-'+i+'.pdf');
}

