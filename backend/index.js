import express from 'express';
import authRoutes from './routes/auth.route.js';
import projectRoutes from './routes/project.route.js';
import bidRoutes from './routes/bid.route.js';
import transactionRoutes from './routes/transaction.route.js';
import { swaggerUi, swaggerSpec } from "./config/swagger.config.js";
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/bid', bidRoutes);
app.use('/api/v1/transaction', transactionRoutes);

export default app;