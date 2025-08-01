# Deploying to Render with On-Demand Scaling

This guide explains how to deploy the tracker-server to Render with on-demand scaling enabled.

## Prerequisites

1. A Render account
2. A MongoDB database (MongoDB Atlas recommended)
3. Your application code pushed to a Git repository

## Environment Variables

Set these environment variables in your Render service:

- `MONGODB_URI`: Your MongoDB connection string
- `NODE_ENV`: Set to `production`

## Deployment Steps

1. **Connect your repository to Render:**
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your Git repository
   - Select the `tracker-server` directory

2. **Configure the service:**
   - **Name**: tracker-server
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Starter (supports on-demand scaling)

3. **Set environment variables:**
   - Add `MONGODB_URI` with your MongoDB connection string
   - Add `NODE_ENV` with value `production`

4. **Configure scaling (On-Demand):**
   - **Min Instances**: 0 (scales to zero when not in use)
   - **Max Instances**: 10
   - **Target Concurrency**: 10
   - **Target CPU Utilization**: 70%

## Scaling Configuration

The `render.yaml` file is configured for on-demand scaling:

- **Min Instances**: 0 - The service will scale to zero when not in use
- **Max Instances**: 10 - Maximum number of instances during high traffic
- **Target Concurrency**: 10 - Requests per instance before scaling
- **Target CPU**: 70% - CPU threshold for scaling decisions

## Benefits of On-Demand Scaling

- **Cost Savings**: Pay only when the service is used
- **Automatic Scaling**: Scales up during traffic spikes
- **Zero Downtime**: Scales to zero when not in use
- **Performance**: Maintains response times under load

## Monitoring

Monitor your service in the Render dashboard:
- View logs in real-time
- Monitor scaling events
- Track performance metrics
- Set up alerts for scaling events

## API Endpoints

Once deployed, your API will be available at:
- Base URL: `https://your-service-name.onrender.com`
- Health Check: `GET /`
- Expenses API: `GET /api/expenses`

## Troubleshooting

1. **Cold Start**: First request after scaling from zero may be slower
2. **Database Connection**: Ensure MongoDB URI is correct
3. **Environment Variables**: Verify all required variables are set
4. **Logs**: Check Render logs for deployment issues 