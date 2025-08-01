# Deployment Checklist for Render

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All code is committed to Git repository
- [ ] `render.yaml` file is in the root of tracker-server directory
- [ ] Environment variables are documented
- [ ] CORS origin is updated to your frontend URL
- [ ] Health check endpoint is implemented (`/health`)

### ✅ Database Setup
- [ ] MongoDB Atlas cluster is created
- [ ] Database user is created with proper permissions
- [ ] Network access is configured (0.0.0.0/0 for Render)
- [ ] Connection string is ready

### ✅ Render Account Setup
- [ ] Render account is created
- [ ] Git repository is connected to Render
- [ ] Payment method is added (required for on-demand scaling)

## Deployment Steps

### 1. Create Render Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select the `tracker-server` directory

### 2. Configure Service Settings
- **Name**: `tracker-server`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Starter` (supports on-demand scaling)

### 3. Set Environment Variables
Add these in the Render dashboard:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
NODE_ENV=production
```

### 4. Configure Scaling
- **Min Instances**: `0`
- **Max Instances**: `10`
- **Target Concurrency**: `10`
- **Target CPU Utilization**: `70%`

### 5. Deploy
- Click "Create Web Service"
- Monitor the build logs
- Wait for deployment to complete

## Post-Deployment Verification

### ✅ Health Check
- [ ] Visit `https://your-service.onrender.com/health`
- [ ] Should return status 200 with uptime info

### ✅ API Endpoints
- [ ] Test base endpoint: `https://your-service.onrender.com/`
- [ ] Test expenses endpoint: `https://your-service.onrender.com/api/expenses`

### ✅ Frontend Integration
- [ ] Update frontend API base URL to your Render service URL
- [ ] Test API calls from frontend
- [ ] Verify CORS is working correctly

### ✅ Monitoring
- [ ] Check Render dashboard for logs
- [ ] Monitor scaling events
- [ ] Set up alerts if needed

## Troubleshooting

### Common Issues
1. **Build fails**: Check package.json and dependencies
2. **Database connection fails**: Verify MongoDB URI and network access
3. **CORS errors**: Ensure frontend URL is correctly set in CORS config
4. **Cold start delays**: Normal for on-demand scaling, first request may be slower

### Useful Commands
```bash
# Check service logs
# Use Render dashboard or CLI

# Test health endpoint locally
curl http://localhost:4000/health

# Test API endpoint locally
curl http://localhost:4000/api/expenses
```

## Cost Optimization
- On-demand scaling will keep costs low when not in use
- Monitor usage in Render dashboard
- Consider setting up usage alerts 