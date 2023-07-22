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
        verified: { type:Boolean, default : false},
        address: String,
        number: String,
        region: String
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

app.put("/updateUser", async (req, res) => {
  const { _id, address, number , region} = req.body;
  console.log(address)
  try {
    // Find the user in the database based on their ID or any other identifier
    const user = await userModel.findById({_id});

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user data
    user.address = address;
    user.number = number;
    user.region = region;

    // Save the updated user data to the database
    await user.save();

    // Send a response indicating the successful update
    res.json({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "An error occurred while updating user data" });
  }
});

app.get("/:id/verify/:token/", async (req, res) => {
	try {
		const user = await userModel.findOne({ _id: req.params.id });
		if (!user) return res.status(400).send({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await userModel.updateOne({ _id: user._id}, {verified: true });
    await token.deleteOne()

		res.send({ message: "Email verified successfully" });
	} catch (error) {
    console.log(error);
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
            verified: result.verified,
            address: result.address,
            number: result.number,
            region:result.region
          };
          console.log(dataSend)
          if (dataSend.verified == false) {
            let token = await Token.findOne({userId: dataSend._id});
            if (!token) {
              token = await new Token({
                userId: dataSend._id,
                token: crypto.randomBytes(32).toString("hex"),
              }).save();
              const url = `${process.env.BASE_URL}index/${dataSend._id}/verify/${token.token}`;
              await sendEmail(dataSend.email, "Verify Email", 'click here to verify your email (link expires in 3 minutes): ' + url);
            }
            res.send({message: "An email has been sent to your account, please verify before logging in!", alert : false})
          } else {
            res.send({message : "Login is successful!", alert : true, data : dataSend})
          }
    }
    else {
        res.send({message : "Email or Password is incorrect/Not signed up.", alert : false})
      }
})

//product section

const schemaProduct = mongoose.Schema({
    name : String,
    category : String,
    image : String,
    price : String,
    description : String,
    user : String,
    region : String,
    status: String,
    address: String,
    number: String
});

const productModel = mongoose.model("product", schemaProduct)

//upload product in db (api)

app.post("/uploadProduct", async (req,res) => {
  console.log(req.body)
  const data = await productModel(req.body)
  const datasave = await data.save()
  res.send({message : "Uploaded successfully"})

})

app.get("/product", async (req,res) => {
  const data = await productModel.find({})
  res.send(JSON.stringify(data))
})

app.post("/deleteProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.updateOne({ _id: id }, { status: "Deleted" });
    res.send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the product" });
  }
});

app.put('/editProduct/:productId', (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;

  // Update the product in the database based on the productId and updatedProductData
  // Your implementation logic goes here...

  // For example, you can use a database query or ORM to update the product
  productModel.findByIdAndUpdate(productId, updatedProductData, { new: true })
    .then(updatedProduct => {
      // Send a response indicating the success of the update operation
      res.json({ success: true, message: 'Product updated successfully' });
    })
    .catch(error => {
      console.error('Error updating product:', error);
      // Send a response indicating the failure of the update operation
      res.status(500).json({ success: false, message: 'Failed to update product' });
    });
});



//orders section

const schemaOrder = mongoose.Schema({
  product : String,
  timeSlot : String,
  state : String,
  timePlaced : String,
  timeState : String,
  residence: String,
  deliveryFee: String,
  user : String,
  deliverer: String,
  studentNumber: String,
  delivererNum: String,
  delivererName: String
})

const orderModel = mongoose.model("order", schemaOrder)

app.post("/uploadOrder" , async (req, res) => {
  console.log(req.body)
  const data = await orderModel(req.body)
  const datasave = await data.save()
  res.send({message: "Uploaded successfully"})
}) 

app.get("/order", async (req, res) => {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const timeSlotCondition = {
    $expr: {
      $and: [
        { $lte: [{ $toInt: { $substr: ["$timeSlot", 0, 2] } }, currentHour] },
        {
          $or: [
            { $lt: [{ $toInt: { $substr: ["$timeSlot", 0, 2] } }, currentHour] },
            { $lte: [{ $toInt: { $substr: ["$timeSlot", 3, 2] } }, currentMinute] }
          ]
        }
      ]
    },
    state: "Available"
  };

  const updateOperation = {
    $set: { state: "Expired" }
  };

  await orderModel.updateMany(timeSlotCondition, updateOperation);

  const updatedData = await orderModel.find({}); // Fetch updated data after the update operation

  res.send(JSON.stringify(updatedData));
});

app.post("/orderAccept" , async (req, res) => {
  const { itemIds, delivererId, delivererName, delivererNum } = req.body;
  console.log(delivererId)
  try {
    await orderModel.updateMany(
      { _id: { $in: itemIds } },
      { $set: { state: 'Accepted' , deliverer: delivererId, delivererName: delivererName, delivererNum: delivererNum }}
    );
    res.json({ message: 'Item(s) accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while accepting items' });
  }
}) 

app.post("/orderDeliver" , async (req, res) => {
  const { itemIds } = req.body;
  try {
    await orderModel.updateMany(
      { _id: { $in: itemIds } },
      { $set: { state: 'Delivered' }}
    );
    res.json({ message: 'Item(s) registered as delivered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while accepted items' });
  }
})

app.post('/cancelOrder', async (req, res) => {
  const { itemIds } = req.body
  console.log(itemIds)
  try {
    await orderModel.deleteMany({ _id: { $in: itemIds } });
    res.send({ message: "Order(s) cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while cancelling the order" });
  }
});

//notification section

const schemaNotification = mongoose.Schema({
  orderId: String,
  productId: String, 
  productName: String,
  timeSlot: String,
  studentId: String,
  sellerId: String,
  sellerViewed: Boolean,
  studentViewed: Boolean 
})

const notificationModel = mongoose.model("notification", schemaNotification)

app.post("/pushNotification" , async (req, res) => {
  console.log(req.body)
  const data = await notificationModel(req.body)
  const datasave = await data.save()
  res.send({message: "Notification sent successfully"})
}) 

app.get("/notification", async (req,res) => {
  const data = await notificationModel.find({})
  res.send(JSON.stringify(data))
})

app.post("/updateNotification", async(req, res) => {

  const { id } = req.body;
  const user = await userModel.findOne({ _id: id })

  await notificationModel.deleteMany({ studentViewed: true, sellerViewed: true });

  if (user.role === "student") {
    try {
      await notificationModel.updateMany(
        { studentId: { $in: id } },
        { $set: { studentViewed: true }}
      );
      res.json({ message: 'Student has viewed the notification' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while student viewed notification' });
    }
  } else {
    try {
      await notificationModel.updateMany(
        { sellerId: { $in: id } },
        { $set: { sellerViewed: true }}
      );
      res.json({ message: 'Seller has viewed the notification' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while seller viewed notification' });
    }
  }

})

module.exports = { app,userModel, productModel, orderModel, notificationModel };

app.listen(PORT, () => console.log("Server is running at port : " + PORT))