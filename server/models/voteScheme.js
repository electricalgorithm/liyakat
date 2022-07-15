const mongoose = require("mongoose");

const collectionName = process.env.PRODUCTION_SET == "true" ? "prod_vote" : "dev_vote";

const voteScheme = new mongoose.Schema({

    ipAddress: {
        type: String,
        required: true
    },

    entryId: {
        type: Number,
        required: true,
    },
    
    createdAt: {
        type: Date,
        default: Date,
    },

});

module.exports = mongoose.model(collectionName, voteScheme);