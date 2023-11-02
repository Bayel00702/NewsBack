import ArticleModel from "../models/article.js";
import UsersModel from "../models/user.js"


export const createArticle = async (req, res) => {
    try {
        const user = await UsersModel.findOne({_id: req.body.creatorId});

        if(!user){
            res.status({
                message: "Пользователь не найден (creatorId)",
                status: 403
            })
        }

        const request = req.body;
        const {creatorId, ...reqBody} = request;

        const resData = {
            ...reqBody, creatorData: {
                id: user._id,
                name: user.name,
                image: user.image
            }
        };

        const doc = new ArticleModel(resData);

        await doc.save();

        res.json({
            message: 'Статья добавлена',
            states: 'success'
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
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
};
