import app from './index.js';
import connectDB from './lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation is available at http://localhost:${PORT}/api-docs`);
  });
}