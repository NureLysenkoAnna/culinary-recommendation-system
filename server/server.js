require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
connectDB();

const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);

const preferenceRoutes = require('./routes/preferenceRoutes');
app.use('/api/preferences', preferenceRoutes);

const recommendationRoutes = require('./routes/recommendationRoutes');
app.use('/api/recommendations', recommendationRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
