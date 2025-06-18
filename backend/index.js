import express from 'express';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import projectRoutes from './routes/project.route.js';
import bidRoutes from './routes/bid.route.js';
import { swaggerUi, swaggerSpec } from "./swagger.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/bid', bidRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation is available at http://localhost:${PORT}/api-docs`);
});