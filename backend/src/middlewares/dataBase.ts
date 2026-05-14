import mysql, { type RowDataPacket } from "mysql2"
import dotenv from "dotenv"
import { type Request, type Response, type NextFunction, response } from "express"
dotenv.config()

export const host = process.env.HOST

export const pool = mysql.createPool({
    host: host,
    user: "root",
    password: "",
    database: "chatapp"
}).promise()

export const signVerify = (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password } = req.body
    if (!userName || !email || !password) {
        return res.status(400).json({ message: "all fields are mandatory " })
    }

    next()
}

export const logVerify = (req : Request , res : Response , next : NextFunction) => {
    const {email , password} = req.body
    if(!email || !password) { 
        return res.status(400).json({message : "all fields are mandatory"})
    }
    next()
}



export async function doesExist(req: Request, res: Response, next: NextFunction) {
    const { userName, email } = req.body

    const [existingEmail] = await pool.query<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email])
    const [existingUser] = await pool.query<RowDataPacket[]>(`SELECT * FROM users WHERE userName = ?`, [userName])
    if (existingEmail.length > 0 || existingUser.length > 0) {
        return res.status(400).json({ message: "user already exists" })
    }


    next()


}



export async function isAuth(req: Request, res: Response, next: NextFunction) {
    const cookieToken = req.cookies.token
    if (!cookieToken) {
        return res.status(401).json({ message: "unauthorized" })
    }

    next()
}

