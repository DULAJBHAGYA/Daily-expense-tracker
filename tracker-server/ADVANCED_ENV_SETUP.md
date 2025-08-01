# Advanced Environment Variables Setup

## Production Environment Variables

### Required Variables
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Optional Advanced Variables

#### Performance & Caching
```
REDIS_URL=redis://your-redis-instance:6379
CACHE_TTL=3600
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Security
```
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret
CORS_ORIGIN=https://we-spend.netlify.app
```

#### Monitoring & Logging
```
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-new-relic-key
```

#### Database Optimization
```
MONGODB_POOL_SIZE=10
MONGODB_SOCKET_TIMEOUT=45000
MONGODB_SERVER_SELECTION_TIMEOUT=5000
```

#### API Configuration
```
API_VERSION=v1
API_RATE_LIMIT=true
API_DOCUMENTATION_URL=https://your-service.onrender.com/docs
```

## Advanced Scaling Configuration

### Custom Scaling Rules
```yaml
scaling:
  minInstances: 0
  maxInstances: 20
  targetConcurrency: 15
  targetCpuUtilizationPercent: 60
  targetMemoryUtilizationPercent: 80
  scaleUpCooldown: 300
  scaleDownCooldown: 600
```

### Health Check Configuration
```yaml
healthCheckPath: /health
healthCheckTimeout: 300
healthCheckInterval: 30
```

## Security Headers

### Automatic Security Headers
```yaml
headers:
  - path: /*
    name: X-Frame-Options
    value: DENY
  - path: /*
    name: X-Content-Type-Options
    value: nosniff
  - path: /*
    name: X-XSS-Protection
    value: 1; mode=block
  - path: /*
    name: Strict-Transport-Security
    value: max-age=31536000; includeSubDomains
  - path: /*
    name: Content-Security-Policy
    value: default-src 'self'; script-src 'self' 'unsafe-inline'
```

## Advanced Database Configuration

### MongoDB Atlas Advanced Settings
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority&maxPoolSize=10&socketTimeoutMS=45000&serverSelectionTimeoutMS=5000
```

### Connection Pooling
```
MONGODB_POOL_SIZE=10
MONGODB_SOCKET_TIMEOUT=45000
MONGODB_SERVER_SELECTION_TIMEOUT=5000
```

## Monitoring & Analytics

### Sentry Error Tracking
```
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### New Relic APM
```
NEW_RELIC_LICENSE_KEY=your-new-relic-key
NEW_RELIC_APP_NAME=tracker-server
NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
```

## Rate Limiting Configuration

### Express Rate Limiting
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_MESSAGE=Too many requests, please try again later
```

## Caching Configuration

### Redis Caching (Optional)
```
REDIS_URL=redis://your-redis-instance:6379
CACHE_TTL=3600
CACHE_PREFIX=tracker_
```

## Environment-Specific Configurations

### Development
```
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=*
```

### Staging
```
NODE_ENV=staging
LOG_LEVEL=info
SENTRY_ENVIRONMENT=staging
```

### Production
```
NODE_ENV=production
LOG_LEVEL=warn
SENTRY_ENVIRONMENT=production
CORS_ORIGIN=https://we-spend.netlify.app
```

## Advanced Deployment Options

### Blue-Green Deployment
```yaml
deployment:
  strategy: blue-green
  healthCheckPath: /health
  healthCheckTimeout: 300
```

### Canary Deployment
```yaml
deployment:
  strategy: canary
  canaryPercentage: 10
  canaryDuration: 300
```

## Custom Domains & SSL

### Custom Domain Setup
```yaml
domains:
  - name: api.yourdomain.com
    ssl: true
    forceSSL: true
```

## Backup & Recovery

### Database Backup
```yaml
backup:
  schedule: "0 2 * * *"
  retention: 30
  storage: s3
```

## Cost Optimization

### Resource Limits
```yaml
resources:
  cpu: 0.5
  memory: 512MB
  disk: 1GB
```

### Auto-scaling Rules
```yaml
scaling:
  minInstances: 0
  maxInstances: 5
  targetConcurrency: 10
  targetCpuUtilizationPercent: 70
  scaleUpThreshold: 80
  scaleDownThreshold: 30
``` 