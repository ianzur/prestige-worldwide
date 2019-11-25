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
			default: 'United States',
			required: true
		},
		street: { type: String, required: true },
		type: {	type: String },
		city: {	type: String, required: true },
		state: { type: String, required: true },
		zip: { type: Number, required: true },
		phone: {
			type: String,
			validate: {
			  validator: function(v) {
				return /\d{3}-\d{3}-\d{4}/.test(v);
			  },
			  message: props => `${props.value} is not a valid phone number!`
			},
			required: [true, 'User phone number required']
		},
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
			default: 'United States',
			required: true
		},
		street: { type: String, required: true },
		type: {	type: String },
		city: {	type: String, required: true },
		state: { type: String, required: true },
		zip: { type: Number, required: true },
		phone: {
			type: String,
			validate: {
			  validator: function(v) {
				return /\d{3}-\d{3}-\d{4}/.test(v);
			  },
			  message: props => `${props.value} is not a valid phone number!`
			},
			required: [true, 'User phone number required']
		},
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
				default: Date.now(),
				required: true
			},
			required: true
		}
	]
})

module.exports = mongoose.model('Package', PackageSchema);
