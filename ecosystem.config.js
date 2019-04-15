module.exports = {
	apps: [{
		name: 'lenoxbot',
		script: './lenoxbotlauncher.js',
		watch: true,
		env: {
			NODE_ENV: 'development'
		},
		// eslint-disable-next-line camelcase
		env_production: {
			NODE_ENV: 'production'
		},
		// eslint-disable-next-line camelcase
		node_args: '--max-old-space-size=16384'
	}]
};
