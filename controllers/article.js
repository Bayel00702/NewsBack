import ArticleModel from "../models/article.js";
import UsersModel from "../models/user.js"


export const createArticle = async (req, res) => {
    try {
        const creatorId = req.user._id
        const user = await UsersModel.findOne({_id: creatorId});

        if (!user) {
            return res.status(403).json({
                message: "Пользователь не найден (creatorId)",
            });
        }

        const request = req.body;
        const {...reqBody } = request;

        const resData = {
            ...reqBody,
            creatorData: {
                id: user._id,
                name: user.name,
                image: user.image
            }
        };

        const doc = new ArticleModel(resData);

        await doc.save();

        return res.json({
            message: 'Статья добавлена',
            status: 'success'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const getAllArticles = async (req,res) => {
    try{

        let articles = await ArticleModel.find();

        if(req.query.chapter){
            articles = articles.filter(item => req.query.chapter.includes(item.chapter))
        }

        if(req.query.subchapter){
            articles = articles.filter(item => req.query.subchapter.includes(item.subchapter))
        }


        res.json(articles)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить заказы'
        })
    }
}

export const getOneArticle = async (req,res) => {
    try {
        const article = await ArticleModel.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                message: "Статья не найден",
            });
        }

        const user = await UsersModel.findById(article.creatorData.id);

        const orderWithCreatorData = {
            ...article.toObject(),
            creatorData: {
                id: user._id,
                name: user.name,
                image: user.image,
            },
        };

        res.json(orderWithCreatorData);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Не удалось получить статью",
        });
    }
}

export const increaseViews = async (req, res) => {
    try {
        const articleId = req.params.id; // Получаем id заказа из параметра запроса
        const article = await ArticleModel.findById(articleId);

        if (!article) {
            return res.status(404).json({
                message: 'Заказ не найден',
                status: 'error'
            });
        }

        const userId = req.body.userId;

        if (userId !== article.creatorData.id && userId !== undefined) {
            const updatedArticle = await ArticleModel.findByIdAndUpdate(
                articleId,
                {$inc: {views: 1}},
                {new: true}
            );

            return res.json({
                message: 'Views увеличены',
                status: 'success',
                updatedArticle
            });
        } else {
            return res.json({
                message: 'Вы не можете увеличивать views своего собственного заказа',
                status: 'success',
                article
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось увеличить views',
            status: 'error'
        });
    }
}
