const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // ✅ Only declared once
const cors = require('cors');
const path = require('path');

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Check for critical environment variables
if (!process.env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set in environment variables.");
} else {
  console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "Yes" : "No");
}

if (!process.env.JWT_REFRESH_SECRET) {
  console.warn("Warning: JWT_REFRESH_SECRET is not set in environment variables.");
} else {
  console.log("JWT_REFRESH_SECRET loaded:", process.env.JWT_REFRESH_SECRET ? "Yes" : "No");
}

// Import Middleware & Utils
const logger = require('./utils/logger');
const authenticate = require('./middleware/auth');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const marketRoutes = require('./routes/marketRoutes');
const newsRoutes = require('./routes/newsRoutes');
const tradeRoutes = require('./routes/tradeRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express app
const app = express();

// Global Middleware
app.use(cors());               // Enable CORS
app.use(express.json());       // Parse JSON bodies
app.use(logger);               // Custom request logger

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/trades', authenticate, tradeRoutes);
app.use('/api/portfolio', authenticate, portfolioRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).send('🚀 Backend API is running...');
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  });
