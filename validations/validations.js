import {body} from "express-validator";
import {validationResult} from "express-validator";

export  default (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }
    next()
}

export const registerUserValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({min:5}),
    body('image', 'Неверный путь').optional().isString(),
    body('name', 'Укажите ваше имя').isString(),
];

export const loginUserValidation = [
    body('email','Неверный формат электронной почты').isEmail(),
    body('password', 'Пароль должен быть минимум 8 символов').isLength({min:8})
];

export const addArticleValidation = [
    body('title', 'Заголовок объявления минимум 2 символа').isLength({min:2}),
    body('description1', 'Описание объявления минимум 3 символа').isLength({min:3}),
    body('description2', 'Описание объявления минимум 3 символа').isLength({min:3}),
    body('description3', 'Описание объявления минимум 3 символа').isLength({min:3}),
    body('chapter', 'Неверный формат категории').isString(),
    body('subchapter', 'Неверный формат категории').isString(),
    body('views', 'Неверный формат просмотров').isNumeric(),
];