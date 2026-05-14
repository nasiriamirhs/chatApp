import mysql, {} from "mysql2";
import dotenv from "dotenv";
import { response } from "express";
dotenv.config();
export const host = process.env.HOST;
export const pool = mysql.createPool({
    host: host,
    user: "root",
    password: "",
    database: "chatapp"
}).promise();
export const signVerify = (req, res, next) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ message: "all fields are mandatory " });
    }
    next();
};
export const logVerify = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "all fields are mandatory" });
    }
    next();
};
export async function doesExist(req, res, next) {
    const { userName, email } = req.body;
    const [existingEmail] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
    const [existingUser] = await pool.query(`SELECT * FROM users WHERE userName = ?`, [userName]);
    if (existingEmail.length > 0 || existingUser.length > 0) {
        return res.status(400).json({ message: "user already exists" });
    }
    next();
}
export async function isAuth(req, res, next) {
    const cookieToken = req.cookies.token;
    if (!cookieToken) {
        return res.status(401).json({ message: "unauthorized" });
    }
    next();
}
//# sourceMappingURL=dataBase.js.map