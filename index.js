const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

function readOutput(fpath1, fpath2){
	try { 
		let output = fs.readFileSync(fpath1, 'utf8')
		return output || fs.readFileSync(fpath2, 'utf8')
	} catch (ex) {
		try { return fs.readFileSync(fpath2, 'utf8') }
		catch (ex) {
			return 0
		}
	}
}

function removeOutput(fpath){
	try { fs.unlinkSync(fpath) }
	catch (_exp) { }
	try { fs.unlinkSync(fpath + '.err') }
	catch (_exp) { }
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
		const dbmi = `/tmp/${dst}.dbmi`
		const lint = `/tmp/${dst}.lint`
		const unit = `/tmp/${dst}.unit`
		const inte = `/tmp/${dst}.inte`
		const dbmiRes = readOutput(dbmi + '.err', dbmi)
		const lintRes = readOutput(lint, lint + '.err')
		const unitRes = readOutput(unit, unit + '.err')
		const inteRes = readOutput(inte, inte + '.err')
		removeOutput(`/tmp/${dst}.dbmi`)
		removeOutput(`/tmp/${dst}.lint`)
		removeOutput(`/tmp/${dst}.unit`)
		removeOutput(`/tmp/${dst}.inte`)
		cb(!lintRes || !unitRes || !inteRes ? 'Panic! something very wrong has happened' : null, dbmiRes, lintRes, unitRes, inteRes)
	});
}
