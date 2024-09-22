import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ out: 'build' }),
		alias: {
			'@/*': './path/to/lib/*'
		}
	}
};

export default config;
