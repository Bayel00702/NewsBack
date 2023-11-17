import ChapterModule from '../models/chapters.js'



export const createChapter = async (req,res) => {
    try {
        const doc = new ChapterModule(req.body);

        await doc.save();

        res.json({
            message: "Тема добавлена",
            status: "success"
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось добавить тему'
        })
    }
};

export const getAllChapter = async (req,res) => {
    try {

        const chapter = await  ChapterModule.find();

        res.json(chapter)

    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить категории'
        })
    }
};