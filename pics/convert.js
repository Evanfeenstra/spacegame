var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    const mime = 'image/png'
    var bitmap = fs.readFileSync(file);
    const b = new Buffer(bitmap).toString('base64');
    return 'data:'+mime+';base64,' + b
}

var txt = 'var imgzz = {}\n\n'

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
            const str = "imgzz."+dir+" = " +
                JSON.stringify(filez, null, 2)
            txt += str + '\n\n'
        });
    })
})

setTimeout(()=>{
    fs.writeFile('../js/img.js', txt + end, function (err) {
        if (err) return console.log(err);
        console.log('File Written!');
    });
},2000)

var end = 'var img = {}; '+
'function loadImgs(){'+
  'for (const [key, value] of Object.entries(imgzz)) {'+
    'for (const [name, base64] of Object.entries(value)) {'+
      'img[name] = loadImage(base64)'+
    '}'+
  '}'+
'}'