import { connectToDatabase } from "./pgDB.js";

export const logAudit = async (userEmail, action, details) => {
    try {
        const db = connectToDatabase();
        await db.query(
            "insert into audit_log (user_email, action, details) values ($1,$2,$3)",
            [userEmail || null, action, details || null]
        );
    } catch (err) {
        console.log("Audit log failed:", err.message);
    }
};
