var mongoose = require('../config/dbconnection');
var createError = require('http-errors');

var lobSchema = mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        unique: true
    }
});

lobSchema.statics = {
    async create(data) {
        try {
            const lob = new this(data);
            return await lob.save();
        }catch (e) {
            return Promise.reject(e);
        }
    }
}

const Lob = mongoose.model('Lob', lobSchema);

module.exports = Lob;