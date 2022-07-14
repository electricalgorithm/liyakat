const mongoose = require("mongoose");

const PROD_MODE = false;
const collectionName = PROD_MODE ? "prod_data" : "dev_data";

const entryScheme = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    
    text: {
        type: String,
        required: true,
    },
    
    createdAt: {
        type: Date,
        default: Date,
    },

    votes: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model(collectionName, entryScheme);