const check = require('./index.js')
check('https://github.com/ldarren/pm2-deploy.git', 'pico-git-check-test', 'src/config/dotenv/test/ops.env', 'live', (err, lint, test) => {
	console.error('error:', err)
	console.log('lint:', lint)
	console.log('test:', test)
})
