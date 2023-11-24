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
    description1: {
        type: String,
        required: true
    },
    description2: {
        type: String,
        required: true
    },
    description3: {
        type: String,

    },
    chapter: {
        type: String,
        required: true
    },
    subchapter: {
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