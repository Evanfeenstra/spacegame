var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    const mime = 'image/png'
    var bitmap = fs.readFileSync(file);
    const b = new Buffer(bitmap).toString('base64');
    return 'data:'+mime+';base64,' + b
}

var txt = ''

fs.readdir('.', function(_, dirs){
    dirs.forEach(function(dir){
        const isDir = dir.indexOf('.')===-1
        if(!isDir) return
        fs.readdir('./'+dir, function (err, files) {
            if (err) return console.log('Unable to scan directory: ' + err)
            const filez = {}
            files.forEach(function (file) {
                const a = file.split('.')
                const name = a[0]
                const ext = a.length>1?a[1]:''
                if(ext!=='png') return
                filez[name] = base64_encode(dir+'/'+file)
                console.log(dir+'/'+file)
            });
            const str = "var "+dir+" = " +
                JSON.stringify(filez, null, 2)
            txt += str + '\n\n'
        });
    })
})

setTimeout(()=>{
    fs.writeFile('base64.js', txt, function (err) {
        if (err) return console.log(err);
        console.log('File Written!');
    });
},2000)
