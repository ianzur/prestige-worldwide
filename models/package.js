var mongoose = require('mongoose');

var PackageSchema = new mongoose.Schema({
	
	// packageID
	id: { type: String, index: true	},

	weight: { type: Number },

	size: { 
		length: { type: Number },
		width: { type: Number },
		height: { type: Number } 
	},

	value: { type: Number },

	// where to pick-up
	from: {
		// shipping from
		name: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			// we can only ship to these countrys
			enum: [
				'United States',
				'Spain',
				'Canada',
				'Mexico',
				'Puetro Rico',
			],
			required: true
		},
		street: { type: String, required: true },
		type: {	type: String },
		city: {	type: String, required: true },
		state: { type: String, required: true },
		zip: { type: Number, required: true },
		phone: {
			number: { type: Number, required: true },
		}
	},

	// where to drop off
	to: {
		// shipping to
		name: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			// we can only ship to these countrys
			enum: [
				'United States',
				'Spain',
				'Canada',
				'Mexico',
				'Puetro Rico',
			],
			required: true
		},
		street: { type: String, required: true },
		type: {	type: String },
		city: {	type: String, required: true },
		state: { type: String, required: true },
		zip: { type: Number, required: true },
		phone: {
			number: { type: Number, required: true },
			// extension: { type: Number }
		}
	}, 

	confirm: {
		type: Boolean,
		default: false,
		required: true,
	},

	// location history
  	location: [
    	{
			type: String,
			enum: ['plane', 'airport', 'truck', 'warehouse'],
			timestamp: {
				type: Date,
				default: Date.now()
			}
		}
	]
})

module.exports = mongoose.model('Package', PackageSchema);
