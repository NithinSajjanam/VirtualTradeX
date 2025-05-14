import fetch from 'node-fetch';

async function testRegister() {
  const url = 'http://localhost:5000/api/auth/register';
  const data = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'testpassword'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    });
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegister();
