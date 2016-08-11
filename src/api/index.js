import { version } from '../../package.json';
import { Router } from 'express';
import images from './images';

export default ({ config, db }) => {
	let api = Router();

	// mount the images resource
	api.use('/images', images({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	return api;
}
