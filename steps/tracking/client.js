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

function createJob(url){
  var job = queue.create('download', {
    url: url
  });
  job.on('progress', function(progress, data){
    console.log('file "%s" %d%% complete', job.data.url, progress);
  })
  .on('complete', function(result){
    complete++;
    console.log('File "%s" downloaded.', job.data.url);
    if(complete === filesToDownload){
      process.exit(0);
    }
  })
  .removeOnComplete(true)
  .save()

}

//create 10 download jobs
for(var i=1;i<=filesToDownload;i++){
  createJob('http://example.org/document-'+i+'.pdf');
}

