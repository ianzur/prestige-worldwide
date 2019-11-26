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
	// delivered: {}

	// where to pick-up
	from: {
		name: {	type: String, required: true },
		email: { type: String, required: true, index: true },
		phone: { type: String, required: true},
		country: {
			type: String,
			// we can only ship to these countries
			enum: [
				'United States',
				'Spain',
				'Canada',
				'Mexico',
				'Puerto Rico',
			],
			default: 'United States',
			required: true
		},
		street: { type: String, required: true },
		street2: {	type: String },
		city: {	type: String, required: true },
		state: { type: String, required: true },
		zip: { type: Number, required: true },
	},

	// where to drop off
	to: {
		
		name: {	type: String, required: true },
		email: { type: String, required: true, index: true },
		phone: { type: String, required: true},
		country: {
			type: String,
			// we can only ship to these countrys
			enum: [
				'United States',
				'Spain',
				'Canada',
				'Mexico',
				'Puerto Rico',
			],
			default: 'United States',
			required: true
		},
		street: { type: String, required: true },
		street2: {	type: String },
		city: {	type: String, required: true },
		state: { type: String, required: true },
		zip: { type: Number, required: true },
		phone: {
		},
	}, 

	confirm: {
		type: Boolean,
		default: false,
		required: true,
	},

	// location history
  	locations: [
		{
			kind: {
				type: String,
				enum: ['plane', 'airport', 'truck', 'warehouse'],
				required: true,
				default: 'plane',
			},
			timestamp: {
				type: Date,
				default: Date.now(),
				required: true,
			},
		}
	],
});

PackageSchema.path('locations.timestamp').validate( function(v) {
	console.log(v)
	console.log(this.locations)
})

// PackageSchema.query.locations


// before doing anything add some locations to history
// this should be done by admin account "add update function"
PackageSchema.pre('validate', function(next) {

	var numlocs = Math.floor(Math.random() * 4);
	var locations = ['plane', 'airport', 'truck', 'warehouse'];
	var date = new Date();

	if (numlocs === 0) {
		numlocs = 1;
	}

	for (var i = 0; i < numlocs + 1; i++) {
		this.locations.push({ 
			'kind': locations[Math.floor(Math.random() * 4)],
			'timestamp': date.setDate(date.getDate() + 1)  
		})
	}
	console.log(this)
	next()
});

module.exports = mongoose.model('Package', PackageSchema);
