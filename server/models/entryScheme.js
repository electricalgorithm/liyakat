const mongoose = require("mongoose");

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
        type: number,
        default: 0
    }
});

module.exports = mongoose.model("Entry", entryScheme);