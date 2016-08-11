import { version } from '../../package.json';
import { Router } from 'express';
import products from './products';
// TODO: refactor to import products model instead of productsDB
import productsDB from '../db/sku-data.json';
import recommendationsModel from '../models/recommendations';

export default ({ config, db }) => {
	let api = Router();


	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

  // mount the products resource
  api.use('/products', products({ config, db }));

  // Recommendations Endpoints
  // TODO: abstract this into a separate model

  api.get('/recommendations/:sku/:n*?', (req, res) => {
    let { sku, n } = req.params;

    // parse, validate, set default value for number of recommendations to show
    n = parseInt(n) || 5;

    const products = (productsDB.hasOwnProperty(sku) ? productsDB[sku] : null);
    if (!productsDB) {
      return res.status(500).send('Sku not found!');
    }

    function getRecommendations(sku, n, productsDB) {
      function getIntInRange(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
      }

      const skus = Object.keys(productsDB);

      const results = {};

      // Use Recommendation Data if we have it
      if (recommendationsModel.hasOwnProperty(sku)) {
        console.log(recommendationsModel[sku]);
        recommendationsModel[sku].forEach(sku => {
          const skuObj = productsDB[sku];
          results[sku] = skuObj;
        });
      } else {
        // Get n number of random items
        for (let i = 0; i < n; i++) {
          const skuIdx = getIntInRange(0, skus.length - 1);
          const sku = skus[skuIdx];
          const skuObj = productsDB[sku];
          results[sku] = skuObj;
        }
      }

      return results;
    }

    res.send(getRecommendations(sku, n, productsDB));
  });

	return api;
}
