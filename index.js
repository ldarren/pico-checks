const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

function readOutput(path){
	try { return fs.readFileSync(path, 'utf8') }
	catch (ex) {
		try { return fs.readFileSync(path+'.err', 'utf8') }
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
module.exports = function(repo, dst, cfgpath, ref, cb) {
	const shellSyntaxCommand = path.join( __dirname.replace(/\\/g, '/'), 'check ') + `${repo} ${dst} ${cfgpath} ${ref}`
	const proc = childProcess.spawn('sh', ['-c', shellSyntaxCommand], { stdio: 'inherit' })

	proc.on('error', cb)

	// TODO: listen to stdout instead of passing data by file

	proc.on('close', function (code) {
		if (code !== 0) return cb(code)
		const dbmiRes = readOutput(`/tmp/${dst}.dbmi`)
		const lintRes = readOutput(`/tmp/${dst}.lint`)
		const unitRes = readOutput(`/tmp/${dst}.unit`)
		const inteRes = readOutput(`/tmp/${dst}.inte`)
		try {
			fs.unlinkSync(`/tmp/${dst}.dbmi.err`)
			fs.unlinkSync(`/tmp/${dst}.lint.err`)
			fs.unlinkSync(`/tmp/${dst}.unit.err`)
			fs.unlinkSync(`/tmp/${dst}.inte.err`)
			fs.unlinkSync(`/tmp/${dst}.dbmi`)
			fs.unlinkSync(`/tmp/${dst}.lint`)
			fs.unlinkSync(`/tmp/${dst}.unit`)
			fs.unlinkSync(`/tmp/${dst}.inte`)
		} catch (exp) { }
		cb(!lintRes || !unitRes || !inteRes ? 'Panic! something very wrong has happened' : null, dbmiRes, lintRes, unitRes, inteRes)
	});
}
