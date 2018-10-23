const check = require('./index.js')
check('https://github.com/ldarren/pm2-deploy.git', 'pico-git-check-test', '.gitignore', 'live', (err, dbmi, lint, unit, inte) => {
	console.error('error:', err)
	console.log('dbmi:', dbmi)
	console.log('lint:', lint)
	console.log('unit:', unit)
	console.log('inte:', inte)
})
