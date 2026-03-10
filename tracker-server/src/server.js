const app = require('./app');
const connectDB = require('./utils/db');

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, async () => {
  console.log('\n' + '='.repeat(50));
  console.log('Server started successfully!');
  console.log('='.repeat(50));
  console.log(`Server running on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Test database connection on startup
  try {
    await connectDB();
    console.log('Database: Connected');
  } catch (error) {
    console.log('Database: Not Connected');
    console.log('WARNING: Server running without database connection');
  }
  
  console.log('='.repeat(50) + '\n');
});
