import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength:30
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    image: String,
}, {
    timestamps: true
});


export default mongoose.model('user', userSchema)