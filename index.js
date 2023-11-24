import express from 'express'
import mongoose from "mongoose"
import multer from 'multer'
import cors from 'cors'
import cloudinary from "cloudinary"
import fs from "node:fs"
import usersModel from './models/user.js'
import {registerUser, loginUser} from "./controllers/auth.js";
import {registerUserValidation, addArticleValidation, loginUserValidation} from "./validations/validations.js";
import handleValidator from "./validations/validations.js";
import {isAdmin} from "./validations/checkAuth.js";
import {createArticle, getAllArticles, getOneArticle, increaseViews} from "./controllers/article.js";
import {getAllUser} from "./controllers/users.js";
import {createChapter, getAllChapter} from "./controllers/chapter.js";
import {createSubChapter, getAllSubChapters} from "./controllers/subChapter.js";
import Article from "./models/article.js";

const api = express();
api.use(express.json());
api.use(cors())

const mongoDbPassword= 'opU0vLAqGoHUigES';

mongoose.connect(`mongodb+srv://Anna:${mongoDbPassword}@news.intixj7.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Mongo DB успешно запущен'))
    .catch((err) => console.log('Ошибка при запуске Mongo DB', err));


const PORT = process.env.PORT || 2020;


//auth
api.post('/register', handleValidator, registerUserValidation, registerUser);
api.post('/login', loginUser, handleValidator, loginUserValidation);

//users
api.get('/users', getAllUser );

//article
api.post('/article', isAdmin, addArticleValidation, handleValidator, createArticle);
api.get('/articles?', getAllArticles);
api.get('/article/:id', getOneArticle)

//chapter
api.post('/chapter', createChapter, isAdmin, handleValidator)
api.get('/chapter', getAllChapter)

//subChapter
api.post('/subchapter', createSubChapter, isAdmin, handleValidator)
api.get('/subchapter/:chapterId', getAllSubChapters)

//views

api.post('/increase-views/:id', increaseViews)


const upload = multer({destination: 'uploads/'});

cloudinary.config({
    cloud_name: 'dcvi1kp3v',
    api_key: '572666124715384',
    api_secret: 'VrrwhzYiVrvqC03mFk-RAnP4SMA'
});

api.post('/upload', upload.single('file'),(req,res) => {

    const file = req.file;

    if(!file){
        return res.status(400).send('Файл не найден');
    }

    const filename = `${Date.now()}_${file.originalname}`;
    const tempFilePath = `uploads/${filename}`;
    fs.writeFileSync(tempFilePath, file.buffer);


    cloudinary.v2.uploader.upload(tempFilePath, (err,result) => {
        if (err) {
            console.log('Ошибка загрузики файла', err);
            return res.status(500).send('Ошибка загрузки файла')
        }
        fs.unlinkSync(tempFilePath);

        const publicUrl = result.secure_url;
        res.json({
            url: publicUrl
        });
    })
});
api.post('/reset/upload/:id', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if(!file){
            return res.status(400).send('Файл не найден');
        }

        const filename = `${Date.now()}_${file.originalname}`;
        const tempFilePath = `uploads/${filename}`;
        fs.writeFileSync(tempFilePath, file.buffer);

        cloudinary.v2.uploader.upload(tempFilePath, async (err,result) => {
            if (err) {
                console.log('Ошибка загрузики файла', err);
                return res.status(500).send('Ошибка загрузки файла')
            }
            fs.unlinkSync(tempFilePath);

            const publicUrl = result.secure_url;
            const articleId = req.params.id;
            const updatedUser = await Article.findByIdAndUpdate(
                articleId,
                { image: publicUrl } ,
                { new: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({
                message: 'Image successfully changed',
                user: updatedUser,
            });
        })



    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to update image',
        });
    }
});

api.use('/uploads', express.static('uploads'));


api.listen(PORT,()=>{
    console.log(`Сервер запущен на порту http://localhost:${PORT}`)
});