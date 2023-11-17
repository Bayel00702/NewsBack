import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send("Access denied. Not autheicated...");
    }


    try {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        const decoded = jwt.verify(token, jwtSecretKey);

        req.user = decoded;

        next();
    } catch (err) {
        res.status(400).send("Invalid auth token...\n" + err);
    }
};

export const isAdmin = (req, res, next) => {
    auth(req, res, () => {
        if (req.user && req.user.isAdmin)
        {
            next();
        } else {
            res.status(403).send('Access denied. Not authorized...');
        }
    });
};