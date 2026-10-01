import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token missing" });
        }

        // Expect format: "Bearer <token>"
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: "Token format invalid. Use: Bearer <token>" });
        }

        const token = parts[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        req.isAdmin = decoded.isAdmin === true;
        next();

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired — please log in again" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default verifyToken;
