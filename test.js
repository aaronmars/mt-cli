const progress = require('progress-stream');
const fs = require('fs');
const fetch = require('node-fetch');

const filename = process.argv[2];

function _fileStat(file) {
    return new Promise((resolve, reject) => {
        fs.stat(file, (err, stats) => {
            if(err) {
                reject(err);
            } else {
                resolve(stats);
            }
        });
    });
}
function _postData(file, size) {
    const progressStream = progress({
        length: size,
        time: 10
    });
    progressStream.on('progress', (p) => console.log(p));
    const stream = fs.createReadStream(file);
    const headers = { 'Content-Length': size };
    return fetch('http://www.example.com', { method: 'POST', body: stream.pipe(progressStream), headers: headers });
}
_fileStat(filename).then((stats) => {
    console.log(stats);

    // return _postData(filename, stats.size);
}).then((res) => {
    // console.log(res);
}).catch((fetchErr) => {
    console.log(fetchErr);
});
