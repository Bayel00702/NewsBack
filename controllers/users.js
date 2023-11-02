import UsersModel from '../models/user.js'

export const getAllUser = async (req, res) => {
    try {

        const users = await UsersModel.find({
            status: req.query.status
        });

        res.json(users)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить пользователей'
        })
    }
};
