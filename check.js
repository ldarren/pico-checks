const fs = require('fs')
const childProcess = require('child_process')
const path = require('path')

/**
 * Spawn a modified version of visionmedia/deploy
 *
 * @param {string} hostJSON: config string to be piped to deploy
 * @callback cb
 */
module.exports = function(repo, dst, ref, cb) {
	const shellSyntaxCommand = path.join( __dirname.replace(/\\/g, '/'), 'check ') + `${repo} ${dst} ${ref}`
	const proc = childProcess.spawn('sh', ['-c', shellSyntaxCommand], { stdio: 'inherit' })

	proc.on('error', cb)

	proc.on('close', function (code) {
		if (code !== 0) return cb(code)
		const lintRes = fs.readFileSync(`/tmp/${dst}.lint`, 'utf8')
		const testRes = fs.readFileSync(`/tmp/${dst}.result`, 'utf8')
		cb(null, lintRes, testRes)
	});
}
