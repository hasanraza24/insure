var mongoose = require('../config/dbconnection');
const createError = require('http-errors');

var policySchema = mongoose.Schema({
    ploicy_number: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    policy_category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    carrier: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

policySchema.statics = {
    async create(data) {
        try {
            const policy = new this(data);
            return await policy.save();
        }catch (e) {
            return Promise.reject(e);
        }
    },

    async getPolicyForUser(userId) {
        try {
            if(!mongoose.Types.ObjectId.isValid(userId))  {
                throw createError(400, 'Userid is not valid');
            }
            const policy = await this.aggregate([
                { $match: { userId: mongoose.Types.ObjectId(userId) } },
                { $lookup: {
                    from: 'lobs',
                    localField: 'policy_category',
                    foreignField: '_id',
                    as: 'policy_category'
                } },
                { $unwind: { path: '$policy_category', preserveNullAndEmptyArrays: true } },
                { $lookup: {
                    from: 'carriers',
                    localField: 'carrier',
                    foreignField: '_id',
                    as: 'company_name'
                } },
                { $unwind: { path: '$company_name', preserveNullAndEmptyArrays: true } }
            ]);
            return policy;
        }catch(e) {
            return Promise.reject(e);
        }
    }
}

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;