# Deploying Tracker Server on Back4App

## Prerequisites

1. **Back4App Account**: Sign up at [back4app.com](https://back4app.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **MongoDB Database**: Already configured with your Atlas cluster

## Deployment Steps

### 1. Sign up for Back4App

1. Go to [back4app.com](https://back4app.com)
2. Create a free account
3. Verify your email

### 2. Create a New App

1. **Login to Back4App Dashboard**
2. Click **"Create New App"**
3. Choose **"Backend as a Service"**
4. Select **"I have a backend"**
5. Choose **"Node.js"** as your backend

### 3. Connect Your Repository

1. **Connect GitHub**:
   - Click "Connect GitHub"
   - Authorize Back4App to access your repositories
   - Select your repository: `daily-expense-tracker`

2. **Configure Repository**:
   - **Root Directory**: `tracker-server`
   - **Branch**: `main` (or your default branch)

### 4. Configure Environment Variables

In your Back4App dashboard, go to **"Environment Variables"** and add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | `mongodb+srv://dulajupananda:FY1iTZKbB22FcU4t@wespendcluster0.f4kktid.mongodb.net/tracker?retryWrites=true&w=majority` |
| `PORT` | `8080` |

### 5. Deploy

1. **Click "Deploy"**
2. **Wait for build** (usually 2-5 minutes)
3. **Check logs** for any errors

### 6. Get Your API URL

After successful deployment, you'll get a URL like:
```
https://your-app-name.back4app.io
```

### 7. Update Frontend Configuration

Update your frontend API configuration to use the new Back4App URL:

```javascript
// In your frontend API configuration
const API_BASE_URL = 'https://your-app-name.back4app.io';
```

## Testing Your Deployment

### Health Check
Visit: `https://your-app-name.back4app.io/health`

### API Endpoints
- Base URL: `https://your-app-name.back4app.io`
- Expenses API: `https://your-app-name.back4app.io/api/expenses`

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check that all dependencies are in `package.json`
   - Verify the root directory is correct

2. **Database Connection Fails**:
   - Verify your MongoDB URI is correct
   - Check if your MongoDB Atlas cluster is accessible

3. **CORS Errors**:
   - Update the CORS configuration in `app.js` with your frontend URL

## Environment Variables Reference

- `NODE_ENV`: Set to `production` for production mode
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `PORT`: Back4App will set this automatically

## Monitoring

- Use Back4App's built-in logs to monitor your application
- Set up alerts for downtime
- Monitor your MongoDB database usage

## Support

- Back4App Documentation: [docs.back4app.com](https://docs.back4app.com)
- Back4App Community: [community.back4app.com](https://community.back4app.com) 