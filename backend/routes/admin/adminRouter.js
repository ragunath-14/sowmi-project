import express from "express";
import { connectToDatabase } from "../../lib/pgDB.js";
import verifyToken from "../../middleware/verifyToken.js";
import verifyAdmin from "../../middleware/verifyAdmin.js";

const router = express.Router();

router.get("/audit-log", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const db = connectToDatabase();
        const result = await db.query(
            "select id, user_email, action, details, created_at from audit_log order by created_at desc limit 200"
        );
        res.json({ logs: result.rows });
    } catch (err) {
        console.log("Audit log fetch error:", err.message);
        res.status(500).json({ message: "Failed to fetch audit log" });
    }
});

export default router;
