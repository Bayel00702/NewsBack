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

        // if (req.query.price === 'asc') {
        //     orders = await OrdersModel.find().sort({price: 1})
        // } else if (req.query.price === 'desc') {
        //     orders = await OrdersModel.find().sort({price: -1})
        // } else {
        //     orders = await OrdersModel.find()
        // }
        //
        // if (req.query.status) {
        //     orders = orders.filter(item => item.status === req.query.status)
        // }
        //
        // if (req.query.title) {
        //     orders = orders.filter(item => item.title.toLowerCase().startsWith(req.query.title.toLowerCase()))
        // }
        //
        // if (req.query.id) {
        //     orders = orders.filter(item => item.creatorData.id === req.query.id)
        // }
        //
        // if(req.query.category){
        //     orders = orders.filter(item => req.query.category.includes(item.category))
        // }
        //
        // if (req.query.createdAt) {
        //     const filterDate = new Date(req.query.createdAt);
        //
        //     orders = orders.filter((item) => {
        //         const orderDate = new Date(item.createdAt);
        //         return orderDate > filterDate;
        //     });
        // }
        //
        // if (req.query.views === 'asc'){
        //     orders = orders.sort((a,b) => a.views - b.views)
        // }else if(req.query.views === 'desc'){
        //     orders = orders.sort((a,b) => b.views - a.views)
        // }


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
