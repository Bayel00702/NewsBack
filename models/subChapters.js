import mongoose from "mongoose";

const subChapterSchema = new mongoose.Schema({
    subChapterName: {
        type: String,
        required: true
    },
    chapterId: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

export default mongoose.model('subChapter', subChapterSchema)