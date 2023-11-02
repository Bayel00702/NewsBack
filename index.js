import express from 'express'
import mongoose from "mongoose";
import {registerUser, loginUser} from "./controllers/auth.js";
import {registerUserValidation, addArticleValidation, loginUserValidation} from "./validations/validations.js";
import handleValidator from "./validations/validations.js";
import {isAdmin} from "./validations/checkAuth.js";
import {createArticle, getAllArticles} from "./controllers/article.js";
import {getAllUser} from "./controllers/users.js";

const api = express();
api.use(express.json());

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

// article
api.post('/article', isAdmin, addArticleValidation, handleValidator, createArticle);
api.get('/articles', getAllArticles);




api.listen(PORT,()=>{
    console.log(`Сервер запущен на порту http://localhost:${PORT}`)
});