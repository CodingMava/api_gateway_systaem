# High-Performance API Gateway & Rate-Limited Auth System

## Architecture
- **Gateway (Node.js)**: Proxies requests and enforces Rate Limiting using Redis.
- **Backend (Django)**: Handles User Auth (JWT) and Business Logic.
- **Redis**: Rate limiting storage.

## Endpoints
### Gateway (Port 3000)
- `POST /api/auth/token/`: Login (Get JWT)
- `POST /api/users/register/`: Register
- `GET /api/users/protected/`: Requires Bearer Token.

### Rate Limiting
- Configured to allow **10 requests per second** per IP.
- Exceeding this returns `429 Too Many Requests`.

## Running the Project
```bash
docker-compose up --build
```
