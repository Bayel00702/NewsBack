import jwt from 'jsonwebtoken'
export const genAuthToken = (user) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
        console.error("JWT_SECRET_KEY is not defined or empty.");
        throw new Error("JWT_SECRET_KEY is missing or empty.");
    }

    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        jwtSecretKey
        ,
        { expiresIn: '30d' }
    );

    return token;
};

