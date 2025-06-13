import express from 'express';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.route.js';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});