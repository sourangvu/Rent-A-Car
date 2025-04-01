import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
    try {
        // Collect token from cookies
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "User Not Authorized" });
        }

        // Decode token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken) {
            return res.status(401).json({ message: "User Not Authorized" });
        }

        req.user = decodedToken;

        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid Token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token Expired" });
        }

        // Generic error handler
        console.log(error);
        res.status(error.statusCode || 500).json({ message: error.message || "Internal Server Error" });
    }
};