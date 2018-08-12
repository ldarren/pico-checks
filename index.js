const check = require('./check.js')
check('https://github.com/ldarren/pm2-deploy.git', 'wewe', 'master', (err, lint, test) => {
	console.log(err)
	console.log(lint)
	console.log(test)
})
