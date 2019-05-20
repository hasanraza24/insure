var mongoose = require('../config/dbconnection');
var createError = require('http-errors');

var agentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

agentSchema.statics = {
    async create(data) {
        try {
            const agent = new this(data);
            return await agent.save();
        }catch (e) {
            return Promise.reject(e);
        }
    }
}

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;