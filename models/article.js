import mongoose from "mongoose";

const creatorDataSchema = new mongoose.Schema({
    _id: false,
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: String
});

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        required: true
    },
    creatorData: {
        type: creatorDataSchema,
        required: true
    },
    image: String
}, {
    timestamps: true
});

export default mongoose.model('article', articleSchema)