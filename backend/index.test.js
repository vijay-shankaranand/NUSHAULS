const axios = require('axios');
const { app, userModel, productModel, orderModel, notificationModel } = require('./index');
const Token = require("./models/token");
const crypto = require("crypto");
const mongoose = require('mongoose')


const SERVER_URL = 'http://localhost:8080'; 


describe('POST /signup', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await userModel.deleteMany({});
  });

  it('should return "Email id is already registered" if email is already in the database', async () => {
    const email = 'shankaranand48@gmail.com';
    const user = { firstName: 'Test', lastName: 'User', email, password: 'password123' };
    
    // Save the user to the database directly
    await new userModel(user).save();

    // Make the POST request to the /signup endpoint using axios
    const response = await axios.post(`${SERVER_URL}/signup`, user);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Email id is already registered', alert: false });
  });

  it('should create a new user and return "Signup Successful!" if email is not already in the database', async () => {
    const email = 'newuser@example.com';
    const user = { firstName: 'New', lastName: 'User', email, password: 'password123' };

    // Make the POST request to the /signup endpoint using axios
    const response = await axios.post(`${SERVER_URL}/signup`, user);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      message: 'Signup Successful! Please verify your email address first before logging in!',
      alert: true,
    });
  });
});

describe('POST /login', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await userModel.deleteMany({});
  });

  it('should return "Login is successful!" if email and password are correct', async () => {
    const email = 'shankaranand48@gmail.com';
    const password = 'password123';
    const verified = true;
    
    // Save the user to the database directly
    await new userModel({ email, password, verified }).save();

    // Make the POST request to the /login endpoint using axios
    const response = await axios.post(`${SERVER_URL}/login`, { email, password });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Login is successful!', alert: true, data: expect.any(Object) });
  });

  it('should return "Email or Password is incorrect/Not signed up." if email or password is incorrect', async () => {
    const email = 'nonexistent@example.com';
    const password = 'wrongpassword';

    // Make the POST request to the /login endpoint using axios
    const response = await axios.post(`${SERVER_URL}/login`, { email, password });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Email or Password is incorrect/Not signed up.', alert: false });
  });
});

describe('GET /emailVerfification', () => {

  it('should return "Email verified successfully" if the link is valid', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    // Save the user to the database directly
    const user = await new userModel({ email, password }).save();

    // Generate a random token for verification
    const tokenValue = crypto.randomBytes(32).toString('hex');
    const token = await new Token({
      userId: user._id,
      token: tokenValue,
    }).save();

    // Make the GET request to the /:id/verify/:token endpoint using axios
    const response = await axios.get(`${SERVER_URL}/${user._id}/verify/${tokenValue}`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Email verified successfully' });
  });

});

describe('PUT /updateUser', () => {
  it('users are able to edit their credentials and save them to db', async () => {
    // Create a new user and save it to the database
    const user = new userModel({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password123',
      address: 'Old Address',
      number: '123456789',
      region: 'Old Region',
    });
    await user.save();

    // Data to be updated
    const updateData = {
      _id: user._id,
      address: 'New Address',
      number: '987654321',
      region: 'New Region',
    };

    // Make the PUT request to the /updateUser endpoint using axios
    const response = await axios.put(`${SERVER_URL}/updateUser`, updateData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'User data updated successfully' });

    // Fetch the user from the database again to verify the updates
    const updatedUser = await userModel.findById(user._id);

    expect(updatedUser.address).toBe(updateData.address);
    expect(updatedUser.number).toBe(updateData.number);
    expect(updatedUser.region).toBe(updateData.region);
  });

});

describe('POST /uploadProduct', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await productModel.deleteMany({});
  });

  it('should upload a new product and return "Uploaded successfully"', async () => {
    const product = {
      name: 'Sample Product',
      price: "29.99",
      category: 'Electronics',
      description: 'This is a sample product.',
    };

    // Make the POST request to the /uploadProduct endpoint using axios
    const response = await axios.post(`${SERVER_URL}/uploadProduct`, product);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Uploaded successfully' });

    // Verify that the product is saved in the database
    const savedProduct = await productModel.findOne({ name: product.name });
    expect(savedProduct).toBeTruthy();
    expect(savedProduct.price).toBe(product.price);
    expect(savedProduct.category).toBe(product.category);
    expect(savedProduct.description).toBe(product.description);
  });
});

describe('GET /product', () => {
  
  afterEach(async () => {
    // Clean up the database after each test
    await productModel.deleteMany({});
  });


  it('should fetch products from db and send data to dashboard', async () => {
    // Insert some sample products into the database for different users
    const sampleProducts = [
      {
        name: 'Product A',
        price: 19.99,
        category: 'Electronics',
        description: 'This is product A.',
        userId: 'user123',
      },
      {
        name: 'Product B',
        price: 25.99,
        category: 'Fashion',
        description: 'This is product B.',
        userId: 'otherUser',
      },
    ];

    await productModel.insertMany(sampleProducts);

    // Make the GET request to the /product endpoint without the userId query parameter
    const response = await axios.get(`${SERVER_URL}/product`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(2); // We expect all products to be fetched
    
  });

});

describe('POST /deleteProduct', () => {
  
  afterEach(async () => {
    // Clean up the database after each test
    await productModel.deleteMany({});
  });


  it('should delete the product with the specified ID and return "product deleted successfully"', async () => {
    // Insert a sample product into the database
    const sampleProduct = {
      name: 'Product A',
      price: 19.99,
      category: 'Electronics',
      description: 'This is product A.',
      status: 'Active',
    };

    const createdProduct = await productModel.create(sampleProduct);

    // Make the POST request to the /deleteProduct/:id endpoint
    const response = await axios.post(`${SERVER_URL}/deleteProduct/${createdProduct._id}`);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ message: 'Product deleted successfully' });

    // Verify that the product has been updated to 'Deleted' status in the database
    const updatedProduct = await productModel.findById(createdProduct._id);
    expect(updatedProduct.status).toBe('Deleted');
  });
});

describe('PUT /editProduct', () => {
  
  afterEach(async () => {
    // Clean up the database after each test
    await productModel.deleteMany({});
  });


  it('should update the product with the specified ID and saved in db', async () => {
    // Insert a sample product into the database
    const sampleProduct = {
      name: 'Product A',
      price: "19.99",
      category: 'Electronics',
      description: 'This is product A.',
    };

    const createdProduct = await productModel.create(sampleProduct);

    // Define the updated product data
    const updatedProductData = {
      name: 'Updated Product A',
      price: "29.99",
      category: 'Electronics',
      description: 'This is the updated product A.',
    };

    // Make the PUT request to the /editProduct/:productId endpoint
    const response = await axios.put(`${SERVER_URL}/editProduct/${createdProduct._id}`, updatedProductData);

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ success: true, message: 'Product updated successfully' });

    // Verify that the product has been updated in the database
    const updatedProduct = await productModel.findById(createdProduct._id);
    expect(updatedProduct.name).toBe(updatedProductData.name);
    expect(updatedProduct.price).toBe(updatedProductData.price);
    expect(updatedProduct.category).toBe(updatedProductData.category);
    expect(updatedProduct.description).toBe(updatedProductData.description);
  });

});


describe('GET /allproducts', () => {
  // ... (existing beforeAll and afterAll hooks)
  afterEach(async () => {
    // Clean up the database after each test
    await productModel.deleteMany({});
  });


  it('should fetch all products from db and send data to student dashboard', async () => {
    // Insert some sample products into the database for different users
    const sampleProducts = [
      {
        name: 'Product A',
        price: 19.99,
        category: 'Electronics',
        description: 'This is product A.',
        userId: 'user123',
      },
      {
        name: 'Product B',
        price: 25.99,
        category: 'Fashion',
        description: 'This is product B.',
        userId: 'otherUser',
      },
    ];

    await productModel.insertMany(sampleProducts);

    // Make the GET request to the /product endpoint without the userId query parameter
    const response = await axios.get(`${SERVER_URL}/product`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveLength(2); // We expect all products to be fetched
    // Add other assertions as needed
  });

});

describe('POST /uploadOrder', () => {
  beforeEach(async () => {
    // Before each test, clear the userModel and orderModel collections
    await userModel.deleteMany({});
    await orderModel.deleteMany({});
  });

  afterEach(async () => {
    // Before each test, clear the userModel and orderModel collections
    await userModel.deleteMany({});
    await orderModel.deleteMany({});
  });

  it('should upload an order successfully', async () => {
    // Define the order data
    const orderData = {
      product: 'Product 1',
      timeSlot: 'Morning',
      state: 'Pending',
      timePlaced: '2023-07-20T12:00:00Z',
      timeState: '2023-07-20T12:30:00Z',
      residence: 'Residence 1',
      deliveryFee: '10',
      user: 'User 1',
      deliverer: 'Deliverer 1',
      studentNumber: '123456',
      delivererNum: '7891011',
      delivererName: 'Deliverer Name',
    };

    try {
      // Make the POST request to the /uploadOrder endpoint using axios
      const response = await axios.post(`${SERVER_URL}/uploadOrder`, orderData);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: 'Uploaded successfully' });

      // Verify that the order has been saved in the database
      const savedOrder = await orderModel.findOne({ product: 'Product 1' });
      expect(savedOrder).toBeTruthy();
      expect(savedOrder.timeSlot).toBe('Morning');
      expect(savedOrder.state).toBe('Pending');
      expect(savedOrder.timePlaced).toBe('2023-07-20T12:00:00Z');
      expect(savedOrder.timeState).toBe('2023-07-20T12:30:00Z');
      expect(savedOrder.residence).toBe('Residence 1');
      expect(savedOrder.deliveryFee).toBe('10');
      expect(savedOrder.user).toBe('User 1');
      expect(savedOrder.deliverer).toBe('Deliverer 1');
      expect(savedOrder.studentNumber).toBe('123456');
      expect(savedOrder.delivererNum).toBe('7891011');
      expect(savedOrder.delivererName).toBe('Deliverer Name');
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

  // Add more test cases as needed for different scenarios

});

describe('GET /order', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await orderModel.deleteMany({});
  });

  it('should return all orders', async () => {
    // Create some orders with specific time slots and states in the database
    const orders = [
      {
        product: 'Product 1',
        timeSlot: '24:00',
        state: 'Available',
      },
      {
        product: 'Product 2',
        timeSlot: '24:00',
        state: 'Available',
      },
      {
        product: 'Product 3',
        timeSlot: '24:00',
        state: 'Available',
      },
      {
        product: 'Product 4',
        timeSlot: '24:00',
        state: 'Available', // Not 'Available', so this should not be updated
      },
    ];

    await orderModel.insertMany(orders);

    // Make the GET request to the /order endpoint using axios
    const response = await axios.get(`${SERVER_URL}/order`);

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the response data contains the updated order data
    const updatedOrders = response.data;
    expect(updatedOrders).toHaveLength(4);
    
    
    
  });

  it('should set expired state for relevant orders if current time is after timeslot', async () => {
    
    // Create some orders with specific time slots and states in the database
    const orders = [
      {
        product: 'Product 1',
        timeSlot: '00:00',
        state: 'Available',
      },
      {
        product: 'Product 2',
        timeSlot: '00:00',
        state: 'Available',
      },
      {
        product: 'Product 3',
        timeSlot: '00:00',
        state: 'Available',
      },
      {
        product: 'Product 4',
        timeSlot: '00:00',
        state: 'Available', // Not 'Available', so this should not be updated
      },
    ];

    await orderModel.insertMany(orders);

    // Make the GET request to the /order endpoint using axios
    const response = await axios.get(`${SERVER_URL}/order`);

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the response data contains the updated order data
    const updatedOrders = response.data;
    expect(updatedOrders.every((order) => order.state === 'Expired')).toBe(true);
    
    
    
  });

});

describe('POST /cancelOrder', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await orderModel.deleteMany({});
  });

  it('should cancel the specified order(s)', async () => {
    // Create some orders in the database
    const orders = [
      {
        product: 'Product 1',
        timeSlot: '09:00',
        state: 'Available',
      },
      {
        product: 'Product 2',
        timeSlot: '11:30',
        state: 'Available',
      },
      {
        product: 'Product 3',
        timeSlot: '13:45',
        state: 'Available',
      },
    ];

    const savedOrders = await orderModel.insertMany(orders);

    // Extract the IDs of the orders to cancel
    const itemIds = savedOrders.map((order) => order._id.toString());

    // Make the POST request to the /cancelOrder endpoint using axios
    const response = await axios.post(`${SERVER_URL}/cancelOrder`, { itemIds });

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the orders have been deleted from the database
    const canceledOrders = await orderModel.find({ _id: { $in: itemIds } });
    expect(canceledOrders).toHaveLength(0); // The orders should not exist in the database after cancellation
  });

});

describe('POST /orderAccept', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await orderModel.deleteMany({});
  });

  it('should accept the specified order(s)', async () => {
    // Create some orders in the database
    const orders = [
      {
        product: 'Product 1',
        timeSlot: '09:00',
        state: 'Available',
      },
      {
        product: 'Product 2',
        timeSlot: '11:30',
        state: 'Available',
      },
      {
        product: 'Product 3',
        timeSlot: '13:45',
        state: 'Available',
      },
    ];

    const savedOrders = await orderModel.insertMany(orders);

    // Extract the IDs of the orders to accept
    const itemIds = savedOrders.map((order) => order._id.toString());

    const delivererId = 'deliverer_id';
    const delivererName = 'Deliverer Name';
    const delivererNum = 'Deliverer Number';

    // Make the POST request to the /orderAccept endpoint using axios
    const response = await axios.post(`${SERVER_URL}/orderAccept`, {
      itemIds,
      delivererId,
      delivererName,
      delivererNum,
    });

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the orders have been updated in the database with the new state and deliverer details
    const acceptedOrders = await orderModel.find({ _id: { $in: itemIds }, state: 'Accepted', deliverer: delivererId, delivererName, delivererNum });
    expect(acceptedOrders).toHaveLength(savedOrders.length); // All orders should be updated to the Accepted state
  });

});

describe('POST /orderDeliver', () => {
  beforeEach(async () => {
    // Create test data in the database
    await orderModel.insertMany([
      {
        _id: '70956c36a12c0500245f8d73', // Convert the string to ObjectId
        state: 'Accepted',
      },
      {
        _id: '70956c36a12c0500245f8d74', // Convert the string to ObjectId
        state: 'Accepted',
      },
    ]);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await orderModel.deleteMany({});
  });

  it('should mark item(s) as delivered', async () => {
    const orderIds = ['70956c36a12c0500245f8d73', '70956c36a12c0500245f8d74'];

    // Make the POST request to the /orderDeliver endpoint using axios
    const response = await axios.post(`${SERVER_URL}/orderDeliver`, { itemIds: orderIds });

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the items have been updated as delivered
    const updatedOrders = await orderModel.find({ _id: { $in: orderIds } });
    expect(updatedOrders).toHaveLength(2); // Both orders should still exist
    expect(updatedOrders.every((o) => o.state === 'Delivered')).toBe(true); // All orders should be marked as delivered
  });

});

describe('POST /pushNotification', () => {
  afterEach(async () => {
    // Clean up the database after each test
    await notificationModel.deleteMany({});
  });

  it('should send a notification successfully', async () => {
    const notificationData = {
      orderId: 'order123',
      productId: 'product123',
      productName: 'Test Product',
      timeSlot: '10:00 AM - 12:00 PM',
      studentId: 'student123',
      sellerId: 'seller123',
      sellerViewed: false,
      studentViewed: false,
    };

    // Make the POST request to the /pushNotification endpoint using axios
    const response = await axios.post(`${SERVER_URL}/pushNotification`, notificationData);

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the notification has been saved in the database
    const savedNotification = await notificationModel.findOne({ orderId: notificationData.orderId });
    expect(savedNotification).toBeTruthy();
    expect(savedNotification.productId).toBe(notificationData.productId);
    expect(savedNotification.productName).toBe(notificationData.productName);
  });
});

describe('POST /updateNotification', () => {

  beforeEach(async () => {
    // Create test data in the database
    await notificationModel.insertMany([
      {
        orderId: 'order1',
        productId: 'product1',
        productName: 'Product 1',
        timeSlot: '10:00 AM - 12:00 PM',
        studentId: '70956c36a12c0500245f8d71',
        sellerId: '70956c36a12c0500245f8d72',
        sellerViewed: false,
        studentViewed: false,
      },
      {
        orderId: 'order2',
        productId: 'product2',
        productName: 'Product 2',
        timeSlot: '2:00 PM - 4:00 PM',
        studentId: '70956c36a12c0500245f8d71',
        sellerId: '70956c36a12c0500245f8d72',
        sellerViewed: false,
        studentViewed: false,
      },
    ]);
  });

  afterEach(async () => {
    // Clean up the database after each test
    await userModel.deleteMany({});
    await notificationModel.deleteMany({});
  });

  it('student has viewed notification', async () => {
    const user = { role: 'student', _id: '70956c36a12c0500245f8d71' };
    await new userModel(user).save();

    // Make the POST request to the /updateNotification endpoint using axios
    const response = await axios.post(`${SERVER_URL}/updateNotification`, {id : '70956c36a12c0500245f8d71'});

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the student notifications have been updated as viewed
    const updatedNotifications = await notificationModel.find({ studentId: '70956c36a12c0500245f8d71' });
    expect(updatedNotifications).toHaveLength(2); // Both notifications should still exist
    expect(updatedNotifications.every((n) => n.studentViewed)).toBe(true); // All studentViewed should be true
  });

  it('seller has viewed notification', async () => {
    const user = { role: 'seller', _id: '70956c36a12c0500245f8d72' };

    await new userModel(user).save();

    // Make the POST request to the /updateNotification endpoint using axios
    const response = await axios.post(`${SERVER_URL}/updateNotification`, {id: '70956c36a12c0500245f8d72'});

    // Verify that the response status is 200
    expect(response.status).toBe(200);

    // Verify that the seller notifications have been updated as viewed
    const updatedNotifications = await notificationModel.find({ sellerId: '70956c36a12c0500245f8d72' });
    expect(updatedNotifications).toHaveLength(2); // Both notifications should still exist
    expect(updatedNotifications.every((n) => n.sellerViewed)).toBe(true); // All sellerViewed should be true
  });
});






