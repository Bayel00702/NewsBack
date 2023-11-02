import UsersModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {genAuthToken} from "../others/genAuthToken.js";


export const registerUser = async (req, res) => {
    try {
        const { password, ...user } = req.body;

        const idx = await UsersModel.findOne({
            email: req.body.email
        });

        if (idx) {
            res.status(400).json({
                message: 'Такой аккаунт уже существует'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UsersModel({
            ...user,
            passwordHash: hash
        });

        const userCreate = await doc.save();

        // Generate a JWT token for the newly registered user
        const token = genAuthToken(userCreate);

        const { passwordHash, ...userData } = userCreate._doc;

        res.json({
            user: userData,
            token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
};
export const loginUser = async (req, res) => {
    try {

        const user = await UsersModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Такого аккаунта не существует'
            })
        }

        const inValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!inValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль '
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, 'secret123' , {expiresIn: '30d'});

        const { passwordHash, ...userData} = user._doc;

        res.json({
            user: userData,
            token
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось войти в аккаунт'
        })
    }
};

