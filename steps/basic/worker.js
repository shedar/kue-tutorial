var kue = require('kue');

// We create an queue to work with.
// Prefix allows to have more than one queue in a single redis instance.
// Change redis connetion options if Redis in not local
var queue = kue.createQueue({
  "prefix": "q","redis": {
    "host": "127.0.0.1"
  }
});

// Register a handler for 'download' job type.
// We specify that worker can handle up to 2 jobs of this type at the same time.
queue.process('download', 2, function(job, done){
  //call job implementation with required parameters.
  downloadDocument(job.data.url, done);
});

// stub for document downloading
function downloadDocument(url, done) {
  console.log('Got a file to download "%s"', url);
  setTimeout(function(){
    console.log('File "%s" download complete', url);
    done();
  }, 2000);
}