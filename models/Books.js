const mongoose = require('mongoose');
const {Schema} = mongoose;

const BookSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type: String,
        required: true
    },
    auther:{
        type: String,
        required: true
    },
    category:{
        type: String,
        default: "General"
    },
    pdfLink:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('books', BookSchema);