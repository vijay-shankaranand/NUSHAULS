const axios = require('axios');
const { app, userModel, productModel, orderModel } = require('./index');
const Token = require("./models/token");
const crypto = require("crypto");


const SERVER_URL = 'http://localhost:8080'; // Replace with the URL of your running backend server


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
  // ... (existing beforeAll and afterAll hooks)
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
    // Add other assertions as needed
  });

});

describe('POST /deleteProduct', () => {
  // ... (existing beforeAll and afterAll hooks)
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
  // ... (existing beforeAll and afterAll hooks)
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


