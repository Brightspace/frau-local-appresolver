import { nodeConfig } from 'eslint-config-brightspace';
import globals from 'globals';

export default [
	...nodeConfig,
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'script'
		}
	},
	{
		files:['test/**/*'],
		languageOptions: {
			globals: {
				...globals.mocha,
			}
		}
	}
];
