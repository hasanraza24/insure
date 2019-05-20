var mongoose = require('../config/dbconnection');
var createError = require('http-errors');

var accountSchema = mongoose.Schema({
    account_name: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String
    }
});

accountSchema.statics = {
    async create(data) {
        try {
            const account = new this(data);
            return await account.save();
        }catch (e) {
            return Promise.reject(e);
        }
    }
}

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;