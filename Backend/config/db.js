// Importing the mongoose package to interact with MongoDB
const mongoose = require("mongoose");

// Function to establish a connection to the MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection string from the environment variable
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // To ensure the URL parser uses the new engine
            useUnifiedTopology: true, // To opt in to the new connection management engine
        });

        // Log a success message once the connection is established
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        // If an error occurs during the connection attempt, log the error message
        console.error(`Error: ${err.message}`);

        // Exit the process with a non-zero exit code if the connection fails
        process.exit(1);
    }
};

// Exporting the connectDB function so it can be used in other files
module.exports = connectDB;
