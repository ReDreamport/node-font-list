const path = require('path')
const exec = require('child_process').exec
const iconv = require('iconv-lite')

function tryToGetFonts (s) {
	s = s.replace(/\r/g, "\n")
	let lines = s.split('\n')
	const fonts = []
	for(const line of lines) {
		if(!line) continue
		let name = line.split('\t')[1]
		if(name) {
			name = name.replace(/常规/, "")
			name = name.replace(/粗体/, "")
			name = name.trim()
		}
		// console.log(name, "|||", line)
		if(name) fonts.push(name)
	}
	return fonts
}

module.exports = () => new Promise((resolve, reject) => {
  let fn = path.join(__dirname, 'fonts.vbs')
  //let c = fs.readFileSync(path.join('for_win', 'fonts.vbs'), 'utf-8')
  //fs.writeFileSync(fn, c, 'utf-8')

  let cmd = `cscript "${fn}"`
  exec(cmd, { encoding: 'buffer' }, (err, stdout, stderr) => {
    let fonts = []

    if (err) {
      reject(err)
      return
    }

    if (stdout) {
      //require('electron').dialog.showMessageBox({message: 'stdout: ' + stdout})
      fonts = fonts.concat(tryToGetFonts(iconv.decode(stdout, 'cp936')))
    }
    if (stderr) {
      //require('electron').dialog.showMessageBox({message: 'stderr: ' + stderr})
      fonts = fonts.concat(tryToGetFonts(iconv.decode(stderr, 'cp936')))
    }

    fonts.sort()
    resolve(fonts)
  })
})
