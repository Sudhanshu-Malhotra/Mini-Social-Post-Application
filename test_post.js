const axios = require('axios');
const FormData = require('form-data');

async function testCreatePost() {
  try {
    // 1. Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin', // Using the username from user's .env
      password: 'admin'
    });
    
    const token = loginRes.data.token;
    console.log("Logged in! Token obtained.");

    // 2. Create Post without image
    const formData = new FormData();
    formData.append('text', 'Test post from script ' + new Date().toLocaleTimeString());

    const postRes = await axios.post('http://localhost:5000/api/posts', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Post Created Successfully!", postRes.data);
  } catch (err) {
    console.error("Test Failed!");
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

testCreatePost();
