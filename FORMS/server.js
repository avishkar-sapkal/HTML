require('dotenv').config({ path: './connect.env' }); // Load environment variables from connect.env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet()); // Added security middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Create a schema and model for storing contact form data
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const Contact = mongoose.model('Contact', contactSchema);

// Route to handle form submissions
app.post('/submit-form', async (req, res) => {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    try {
        await newContact.save();
        res.send('Form data saved successfully!');
    } catch (error) {
        res.status(500).send('An error occurred while saving the data.');
    }
});

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/forms.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
