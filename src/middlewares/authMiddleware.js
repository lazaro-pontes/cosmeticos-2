const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]; // Pega apenas o token
        }

        if (!token) {
            return res.status(401).json({ message: "Não autorizado, sem token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado. Faça login novamente." });
        }
        res.status(401).json({ message: "Não autorizado, token inválido" });
    }
};

const adminOnly = (req, res, next) => {
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: "Acesso negado, somente administradores podem realizar esta ação." });
    }
    next();
};

module.exports = { protect, adminOnly };
