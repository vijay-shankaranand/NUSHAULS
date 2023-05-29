const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()


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
        image: String
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
        const save = data.save()
        res.send({message : "Signup Successful! Please log in with your new credentials!", alert : true})
      }
    
})


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
            image: result.image
          };
          console.log(dataSend)
        res.send({message : "Login is successful!", alert : true, data : dataSend})
    }
    else {
        res.send({message : "Email/Password is incorrect. Please try again", alert : false})
      }
})

app.listen(PORT, () => console.log("Server is running at port : " + PORT))