const mongoose = require("mongoose");

const collectionName = process.env.PRODUCTION_SET == "true" ? "prod_data" : "dev_data";

const entryScheme = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    
    text: {
        type: String,
        required: true,
    },

    entryId: {
        type: Number,
        required: true,
    },
    
    createdAt: {
        type: Date,
        default: Date,
    },

    votes: {
        type: Number,
        default: 0
    },

    date: {
        type: String,
        required: true,
        default: null
    }

});

module.exports = mongoose.model(collectionName, entryScheme);