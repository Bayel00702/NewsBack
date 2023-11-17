import mongoose from "mongoose";

const chaptersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

export default mongoose.model('chapter', chaptersSchema)