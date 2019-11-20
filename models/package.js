var mongoose = require('mongoose');

var PackageSchema = new mongoose.Schema({
	
	// packageID
	id: {
		type: String, index: true
	},

	weight: {
		type: double
	},

	size: {
		length: {
			type: Number
		},
		length: {
			type: Number
		},
		length: {
			type: Number
		}
	},

	value: {
		declared: Number
	},

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
		street: {
			type: String,
			required: true,
		},
		type: {
			type: String,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zip: {
			type: Number,
			required: true,
		},
		phone: {
			number: {
				type: Number
			},
			extension: {
				type: Number
			}
		}
	},

	// where to drop off
	to: {

		// shipping to
		name: {
			type: String,
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
			]
		},
		street: {
			type: String,
			required: true,
		},
		type: {
			type: String,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zip: {
			type: Number,
			required: true,
		},
		phone: {
				number: {
					type: Number,
					required: true
				},
				extension: {
					type: Number
				}
		}
	}, 

	confirm: {
		type: bool,
		default: false,
		required: true,
	},

	// current location
  location: [
    {
			type: String,
			enum: ['plane', 'airport', 'truck', 'warehouse'],
			timestamp: {
				type: Date
			}
		}
	]
})

var Package = mongoose.model('User', PackageSchema);
module.exports = Package;