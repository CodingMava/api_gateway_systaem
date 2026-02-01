const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');

const app = express();
const PORT = 3000;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';

const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:6379`,
    enableOfflineQueue: false,
});

redisClient.on('error', (err) => console.log('Redis error:', err));
redisClient.connect().catch(console.error);

// Rate Limiting Middleware
const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    points: 10, // 10 requests
    duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).json({ error: 'Too Many Requests' });
        });
};

app.use(rateLimiterMiddleware);

// Proxy to Django Backend
app.use('/', createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // Optional: Add custom headers or logging
        // console.log(`Proxying ${req.method} request to ${BACKEND_URL}${req.url}`);
    }
}));

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
