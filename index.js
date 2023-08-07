const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const classifideRoutes = require('./routes/classified.route')

const { connection } = require('./config/db');
const { UserModel } = require("./models/User.model")
const {authentication} = require("./middleware/authentication")


const app = express();

app.use(cors({ origin: "*" }))
app.use(express.json());



app.get("/", (req, res) => {

    res.json("welcome to Olx ")
})


app.post("/signup", async (req, res) => {

    let { name, email, password } = req.body

    try {
        const hashedPassword = await bcrypt.hash(password, 5);
        const new_user = new UserModel({ name, email, password: hashedPassword });

        await new_user.save();

        res.json({ msg: "Signup Successful" })

    } catch (error) {

        console.log(error)

        res.status(500).send("Somothing went wrong ")

    }
})



app.post("/login", async (req, res) => {

    let { email, password } = req.body

   
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.send("Signup first")
        } else {
            const hashedPassword = user.password
            bcrypt.compare(password, hashedPassword, function (err, result) {
                if (result) {
                    let token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY)
                    res.send({ msg: "login success", token: token })
                }
                else {
                    res.json("login failed invalid credentials")
                }


            })
        }
    })



    app.use("/",classifideRoutes)




app.listen(process.env.PORT, async () => {
    try {
        await connection
        console.log("connection established to db server")
    } catch (error) {

        console.log(error);
        console.log("connection error to db: " + error)

    }

    console.log("listening on port 8000 ")
})