const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

function readOutput(path){
	try { return fs.readFileSync(path, 'utf8') }
	catch (ex) {
		try { return fs.readFileSync(path+'.out', 'utf8') }
		catch (ex) {
			return 0
		}
	}
}

/**
 * Spawn a modified version of visionmedia/deploy
 *
 * @param {string} repo: repo to be tested
 * @param {string} dst: local repo checkout place
 * @param {string} ref: branch or tag to be checkout
 * @callback cb
 */
module.exports = function(repo, dst, cfg, ref, cb) {
	const shellSyntaxCommand = path.join( __dirname.replace(/\\/g, '/'), 'check ') + `${repo} ${dst} ${cfg} ${ref}`
	const proc = childProcess.spawn('sh', ['-c', shellSyntaxCommand], { stdio: 'inherit' })

	proc.on('error', cb)

	// TODO: listen to stdout instead of passing data by file

	proc.on('close', function (code) {
		if (code !== 0) return cb(code)
		const lintRes = readOutput(`/tmp/${dst}.lint`)
		const testRes = readOutput(`/tmp/${dst}.test`)
		try {
			fs.unlinkSync(`/tmp/${dst}.lint.out`)
			fs.unlinkSync(`/tmp/${dst}.test.out`)
			fs.unlinkSync(`/tmp/${dst}.lint`)
			fs.unlinkSync(`/tmp/${dst}.test`)
		} catch (exp) { }
		cb(!lintRes || !testRes ? 'Panic! something very wrong has happened' : null, lintRes, testRes)
	});
}
