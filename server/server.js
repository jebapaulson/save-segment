const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors()); // Apply CORS globally
app.use(express.json()); // Middleware to parse JSON request bodies

// Define GET route for testing
app.get('/api', (req, res) => {
  res.json({ user: ['user', 'user23', 'user3'] });
});

// Define POST route
app.post('/add', async (req, res) => {
  try {
    // Post data to external webhook
    const response = await axios.post(
      'https://webhook.site/5021b45e-70be-4cc2-8573-21bf46fa5ed4',
      req.body
    );

    // Send response back to client
    res.json(response.data);
    console.log('backresponse', response.data); // Log response data
  } catch (error) {
    console.error('Error occurred:', error.message); // Log error message
    res.status(500).json({ message: 'An error occurred', error: error.message }); // Send JSON error response
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

