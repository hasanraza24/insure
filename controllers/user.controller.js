var User = require('../models/user.model');
const config = require('../config/config');
var _ = require('lodash');
var createError = require('http-errors');
const csv = require('csvtojson');
const path = require('path');
const Carrier = require('../models/carrier.model');
const Lob = require('../models/lob.model');
const Account = require('../models/account.model');
const Policy = require('../models/policy.model');
const Agent = require('../models/agent.model');

const uploadData = async (req, res, next) => {
   try {
     const csvFilePath = '../public/files/sample.csv'
     const jsonData = await csv().fromFile(path.join(__dirname, csvFilePath));
     for(data of jsonData) {
         const userData = {
            firstname: data.firstname,
            dob: data.dob ? new Date(data.dob): null,
            address: data.address,
            phoneNumber: data.phone,
            state: data.state,
            zipCode: data.zip,
            email: data.email,
            gender: data.gender,
            userType: data.userType
         }
         const agentData = { 
             name: data.agent
         }
         const accountData = {
            account_name: data.account_name,
            type: data.account_type
         }
         const carrierData = {
            company_name: data.company_name
         }
         const lobData = {
            category_name: data.category_name
         }
         try {
             let user = await User.findOne({ email: data.email })
             if(!user) user = await User.create(userData);
             let carrier = await Carrier.findOne({ company_name: data.company_name });
             if(!carrier) carrier = await Carrier.create(carrierData);
             let lob = await Lob.findOne({ category_name: data.category_name })
             if(!lob) lob = await Lob.create(lobData);
             const policyData = {
                ploicy_number: data.policy_number,
                startDate: data.policy_start_date,
                endDate: data.policy_end_date,
                policy_category: lob._id,
                carrier: carrier._id,
                userId: user._id
             }
             let policy = await Policy.findOne({ policy_number: data.policy_number })
             if(!policy) await Policy.create(policyData);
             let agent = await Agent.findOne({ name: data.agent })
             if(!agent) await Agent.create(agentData);
             let account = await Account.findOne({ account_name: data.account_name });
             if(!account) await Account.create(accountData);
         }catch(e) {
             console.log('error', e);
         }
     }
     res.json({message: 'Done'});

   }catch(e) {
       next(e);
   } 
};

const getPolicyByUsername = async (req, res, next) => {
    try {   
        const policy = await Policy.getPolicyForUser(req.params.userId);
        res.json({success: true, data: policy });
    }catch(e) {
        next(e)
    }
}

const getUsersPolicy = async (req, res, next) => {
    try {
        const users = await User.getUsersPolicy(req.query);
        res.json({ success: true, data: users });
    }catch(e) {
        next(e)
    }
}

module.exports = {
  uploadData,
  getPolicyByUsername,
  getUsersPolicy
}