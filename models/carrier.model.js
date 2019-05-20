var mongoose = require('../config/dbconnection');
var createError = require('http-errors');

var carrierSchema = mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        unique: true
    }
});

carrierSchema.statics = {
    async create(data) {
        try {
            const carrier = new this(data);
            return await carrier.save();
        }catch (e) {
            return Promise.reject(e);
        }
    }
}

const Carrier = mongoose.model('Carrier', carrierSchema);

module.exports = Carrier;