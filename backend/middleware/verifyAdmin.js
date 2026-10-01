const verifyAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

export default verifyAdmin;
