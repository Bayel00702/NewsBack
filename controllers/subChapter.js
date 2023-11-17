import SubChapters from "../models/subChapters.js"

export const createSubChapter = async (req,res) => {
    try {
        const doc = new SubChapters(req.body);

        await doc.save();

        res.json({
            message: "Под тема добавлена",
            status: "success"
        })
    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось добавить под тему'
        })
    }
}

export const getAllSubChapters = async (req,res) => {
    try {
        const subChapter = await SubChapters.find({chapterId: req.params.chapterId})
        res.json(subChapter)

    }catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить под категории'
        })
    }
}