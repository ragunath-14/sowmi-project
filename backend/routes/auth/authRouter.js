import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { connectToDatabase } from '../../lib/pgDB.js';
import verifyToken from '../../middleware/verifyToken.js';
import { logAudit } from '../../lib/audit.js';

const router = express.Router();

router.post('/signin', async (req, res) => {
    const { email, username, password, number } = req.body;

    try {
        const db = await connectToDatabase();

        const result = await db.query(
            'select * from users where email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            return res.status(401).json({
                message: "Account already exists — login instead"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await db.query(
            `insert into users (email, username, password, number)
             values ($1,$2,$3,$4)`,
            [email, username, hashPassword, number]
        );

        await logAudit(email, "signup", username);

        return res.status(201).json({
            message: "Account Created Successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await connectToDatabase();

        const result = await db.query(
            'select * from users where email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "No user found — signup first"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Wrong Password" });
        }

        const token = jwt.sign(
            { id: user.id, isAdmin: user.is_admin === true },
            process.env.JWT_KEY,
            { expiresIn: '1h' }
        );

        await logAudit(email, "login", null);

        return res.status(200).json({ token, isAdmin: user.is_admin === true });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();

        const result = await db.query(
            "select username,email from users where id = $1",
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(result.rows[0]);

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/dbtest", async (req,res)=>{
  const db = await connectToDatabase();
  const r = await db.query("select now()");
  res.json(r.rows);
});


export default router;
