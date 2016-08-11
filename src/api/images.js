import resource from 'resource-router-middleware';
import images from '../models/images';

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'image',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, sku, callback) {
		const image = (images.hasOwnProperty(sku)) ? images[sku] : null;
		const err = image ? null : 'Not found';
		callback(err, image);
	},

	/** GET / - List all entities */
	index({ params }, res) {
		res.json(images);
	},

	/** GET /:id - Return a given entity */
	read({ image }, res) {
		res.json(image);
	},

	// /** POST / - Create a new entity */
	// create({ body }, res) {
	// 	body.id = images.length.toString(36);
	// 	images.push(body);
	// 	res.json(body);
	// },

	// /** PUT /:id - Update a given entity */
	// update({ image, body }, res) {
	// 	for (let key in body) {
	// 		if (key!=='id') {
	// 			image[key] = body[key];
	// 		}
	// 	}
	// 	res.sendStatus(204);
	// },

	// /** DELETE /:id - Delete a given entity */
	// delete({ image }, res) {
	// 	images.splice(images.indexOf(image), 1);
	// 	res.sendStatus(204);
	// }
});
