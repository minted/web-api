import { version } from '../../package.json';
import { Router } from 'express';
import images from './images';
import imagesDB from '../db/images.json';

export default ({ config, db }) => {
	let api = Router();


	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

  // mount the images resource
  api.use('/images', images({ config, db }));

  // Recommendations Endpoints
  // TODO: abstract this into a separate model

  api.get('/recommendations/:sku/:n*?', (req, res) => {
    let { sku, n } = req.params;

    // parse, validate, set default value for number of recommendations to show
    n = parseInt(n) || 5;

    const images = (imagesDB.hasOwnProperty(sku) ? imagesDB[sku] : null);
    if (!imagesDB) {
      return res.status(500).send('Sku not found!');
    }

    function getRecommendations(sku, n, imagesDB) {
      function getIntInRange(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
      }

      const skus = Object.keys(imagesDB);

      const results = {};

      for (let i = 0; i < n; i++) {
        const skuIdx = getIntInRange(0, skus.length - 1);
        const sku = skus[skuIdx];
        const skuObj = imagesDB[sku];
        results[sku] = skuObj;
      }

      return results;
    }

    res.send(getRecommendations(sku, n, imagesDB));
  });

	return api;
}
