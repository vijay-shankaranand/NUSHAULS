const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const Token = require("./models/token");
const crypto = require("crypto");
const sendEmail = require("./utils/sendEmail");

const app = express()
app.use(cors())
app.use(express.json({limit : "10mb"}))


const PORT = process.env.PORT || 8080

//mongodb connection
console.log(process.env.MONGODB_URL)
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URL)
.then(() =>console.log("Connected to Database"))
.catch((err) => console.log(err))

//schema
const userSchema = mongoose.Schema({
        firstName: String,
        lastName: String,
        email: {
            type : String,
            unqiue : true,
        },
        password: String,
        confirmPassword: String,
        role: String,
        image: String,
        verified: { type:Boolean, default : false}
});

const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res)=>{
    res.send("Server is running");
})

app.post("/signup", async(req,res)=>{
    console.log(req.body)
    const {email} = req.body
    
    const result = await userModel.findOne({email : email})

    if (result) {
        console.log(result)
        res.send({message : "Email id is already registered", alert : false})
    }
    else {
        const data = userModel(req.body)
        const user = await userModel({ ...req.body, password: data.password }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const url = `${process.env.BASE_URL}index/${user._id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", 'click here to verify your email: ' + url);
        res.send({message : "Signup Successful! Please verify your email address first before logging in!", alert : true})
      }
    
})

app.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.params.id });
    console.log(user);
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await userModel.updateOne({ _id: user._id, verified: true });
		await token.remove();

		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

app.post("/login", async(req, res)=> {
    console.log(req.body)
    const {email, password} = req.body
    const result = await userModel.findOne({email : email, password : password})
    if (result) {
        console.log(result)
        const dataSend = {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            role: result.role,
            image: result.image,
            verified: result.verified
          };
          console.log(dataSend)
          if (dataSend.verified == false) {
            let token = await Token.findOne({userId: dataSend._id});
            console.log(token);
            if (!token) {
              token = await new Token({
                userId: dataSend._id,
                token: crypto.randomBytes(32).toString("hex"),
              }).save();
              const url = `${process.env.BASE_URL}index/${dataSend._id}/verify/${token.token}`;
              await sendEmail(dataSend.email, "Verify Email", 'click here to verify your email: ' + url);
            }
            res.send({message: "An email has been sent to your account, please verify!", alert : false})
          } else {
            res.send({message : "Login is successful!", alert : true, data : dataSend})
          }
    }
    else {
        res.send({message : "Email/Password is incorrect. Please try again", alert : false})
      }
})

app.listen(PORT, () => console.log("Server is running at port : " + PORT))