# Deploying Tracker Server on Render

## Prerequisites

1. **MongoDB Database**: You'll need a MongoDB database. You can use:
   - MongoDB Atlas (recommended for production)
   - Or any other MongoDB cloud service

2. **GitHub Repository**: Your code should be in a GitHub repository

## Deployment Steps

### 1. Set up MongoDB Database

If you don't have a MongoDB database:
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string

### 2. Deploy on Render

1. **Sign up/Login to Render**:
   - Go to [render.com](https://render.com)
   - Sign up or login with your GitHub account

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your tracker-server

3. **Configure the Service**:
   - **Name**: `tracker-server` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables**:
   - Click on "Environment" tab
   - Add the following variables:
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: `10000` (Render will override this)

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### 3. Update Frontend Configuration

After deployment, update your frontend to use the new API URL:

```javascript
// In your frontend API configuration
const API_BASE_URL = 'https://your-render-app-name.onrender.com';
```

### 4. Test the Deployment

Your API will be available at:
- Health check: `https://your-app-name.onrender.com/health`
- API base: `https://your-app-name.onrender.com/api/expenses`

## Environment Variables

Make sure to set these in Render's environment variables:

- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render will set this automatically)

## Troubleshooting

1. **Build fails**: Check that all dependencies are in `package.json`
2. **Database connection fails**: Verify your MongoDB URI is correct
3. **CORS errors**: Update the CORS configuration in `app.js` with your frontend URL

## Monitoring

- Use Render's built-in logs to monitor your application
- Set up alerts for downtime
- Monitor your MongoDB database usage 