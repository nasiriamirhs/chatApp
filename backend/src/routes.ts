import { doesExist, isAuth, logVerify, pool, signVerify } from "./middlewares/dataBase.js"
import { Router, type Request, type Response, type NextFunction } from "express"
import bcrypt from "bcrypt"
import jwt, { type JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import type { RowDataPacket } from "mysql2"
import snowflakeId from "snowflake-id"
import multer from "multer"
dotenv.config()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/")
    },
    filename: function (req, file, cb) {
        const cookieToken = req.cookies.token
        const { userID } = <JwtPayload>jwt.verify(cookieToken, jwtSecret)
        cb(null, userID + ".jpg")
    }
})

const upload = multer({ storage })


const SnowConstructor =
    (snowflakeId as any).default ?? snowflakeId;

const snowFlake = new SnowConstructor({
    mid: 42,
    offset: (2019 - 1970) * 31536000 * 1000
})




const router = Router()
const jwtSecret = process.env.JWTSECRET

router.route("/signUp").post(signVerify, doesExist, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, email, password } = req.body
        const hashedPass = await bcrypt.hash(password, 10)
        const snowID: string = snowFlake.generate()
        pool.query(`INSERT INTO users (id , userName , email , password) VALUES (? , ? , ? , ?)`, [snowID, userName, email, hashedPass])
        const cookieToken = jwt.sign({ userID: snowID }, jwtSecret, { expiresIn: "30d" })
        res.status(201).cookie("token", cookieToken).json({ message: "user created successfully" })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})


router.route("/login").post(logVerify, async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const [foundUser] = await pool.query<RowDataPacket[]>(`SELECT * FROM users WHERE email = ?`, [email])
    const user = <RowDataPacket>foundUser[0]

    if (!user) {
        return res.status(400).json({ message: "user not found " })
    }


    try {
        const comparedPass = await bcrypt.compare(password, user.password)
        if (!comparedPass) {
            return res.status(400).json({ message: "password didn't match" })
        }
        const cookieToken = jwt.sign({ userName: user.userName }, jwtSecret, { expiresIn: "30d" })

        res.status(200).cookie("token", cookieToken).json({ message: "logged in successfully" })

    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.route("/users").get(isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [users] = await pool.query(`SELECT userName , isAdmin , createdAt , pfp FROM users`)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: error })
    }
})

router.route("/users/:userID").get(isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userID = req.params.userID
        const [userInfo] = await pool.query<RowDataPacket[]>(`SELECT userName , isAdmin , createdAt , pfp FROM users WHERE id = ?`, [userID])
        const user = userInfo[0]
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ message: error })
    }
}).put(isAuth, upload.single("pfp"), (req: Request, res: Response, next: NextFunction) => {
  try {
        const userID = req.params.userID
        const path = req.file?.path


        if (!req.file) {
            return res.status(400).json({ message: "no image inserted" })
        }

        pool.query(`UPDATE users SET pfp = ? WHERE id = ?`, [path, userID])
        res.status(200).json({ message: "profile picture updated" })

  } catch (error) {
        res.status(500).json({message : error})
  }
})




export default router