var mongoose = require('../config/dbconnection');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String
    },
    userType: {
        type: String
    }
});

userSchema.statics = {
    async create(data) {
        try {
            const user = new this(data);
            return await user.save();
        }catch (e) {
            return Promise.reject(e);
        }
    },

    async getUsersPolicy({ limit=20, skip=0 }) {
        try {
            const users = await this.aggregate([
                { $limit: parseInt(limit) },
                { $skip: parseInt(skip) },
                { $lookup: {
                    from: 'policies',
                    localField: '_id',
                    foreignField: 'userId',
                    // let: { userId: '$_id' },
                    // pipeline: [
                    //     { $match: { userId: '$$userId' } },
                        // { $lookup: {
                        //     from: 'lobs',
                        //     localField: 'policy_category',
                        //     foreignField: '_id',
                        //     as: 'policy_category'
                        // } },
                        // { $unwind: { path: '$policy_category', preserveNullAndEmptyArrays: true } },
                        // { $lookup: {
                        //     from: 'carriers',
                        //     localField: 'carrier',
                        //     foreignField: '_id',
                        //     as: 'company_name'
                        // } },
                        // { $unwind: { path: '$company_name', preserveNullAndEmptyArrays: true } }
                //     ],
                    as: 'policy'
                } },
                { $unwind: { path: '$policy', preserveNullAndEmptyArrays: true } }
            ]);
            return users;
        }catch(e) {
            return Promise.reject(e);
        }
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;