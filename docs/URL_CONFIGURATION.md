# URL/Port Configuration

## Design Philosophy

**One config, all environments** - No environment-specific URLs or ports in code.

## How It Works

### The Magic: Relative URLs + Proxies

```
Frontend Code: fetch('/api/task')  ← Always uses relative URL
                     ↓
        Development or Production?
                     ↓
    ┌────────────────┴────────────────┐
    ↓                                  ↓
Development (Vite)              Production (Nginx)
Proxy /api → backend-dev:3000   Proxy /api → backend-prod:3000
```

### No Build-Time Configuration Needed

- ✅ Same built frontend works in dev, local prod, and server
- ✅ No `VITE_API_URL` needed (defaults to empty = relative URLs)
- ✅ No environment detection in code
- ✅ No runtime configuration

## Implementation

### 1. Frontend Config (`src/config/index.ts`)

```typescript
// Use relative URL if VITE_API_URL is not set (default)
const apiBaseUrl = env.VITE_API_URL
  ? `${env.VITE_API_URL}/api`
  : '/api';  // ← Default: relative URL
```

### 2. Development: Vite Proxy (`vite.config.ts`)

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://backend-dev:3000',
      changeOrigin: true,
    }
  }
}
```

**Result**: `localhost:5153/api/task` → `backend-dev:3000/api/task`

### 3. Production: Nginx Proxy (`nginx.conf`)

```nginx
location /api {
    proxy_pass http://backend-prod:3000;
    proxy_set_header Host $host;
    # ... more headers
}
```

**Result**: `yourdomain.com/api/task` → `backend-prod:3000/api/task`

## Port Mapping

```
Local Development:
  localhost:5153 ──→ Vite dev server ──→ /api proxy ──→ backend-dev:3000

Local Production:
  localhost:5154 ──→ Nginx ──→ /api proxy ──→ backend-prod:3000

Server Production:
  yourdomain.com:443 ──→ Host Nginx ──→ localhost:5154 ──→ Container Nginx ──→ backend-prod:3000
```

## Files Modified

1. **Frontend**
   - `src/config/index.ts` - Relative URL logic
   - `.env.development` - Empty VITE_API_URL (defaults to relative)
   - `.env.production` - Empty VITE_API_URL (defaults to relative)
   - `nginx.conf` - Production proxy config
   - `Dockerfile.prod` - Copy nginx.conf
   - `.gitignore` - Ignore local env files

2. **Docker**
   - `docker-compose.yml` - Add depends_on for frontend-prod → backend-prod

3. **Documentation**
   - `DEPLOYMENT.md` - Complete deployment guide
   - `docs/URL_CONFIGURATION.md` - This file

## Advantages

1. **Simple**: One configuration for all environments
2. **Secure**: No hardcoded backend URLs
3. **Professional**: Industry-standard proxy pattern
4. **Flexible**: Override with VITE_API_URL if needed (e.g., different backend domain)
5. **CORS-free**: Same-origin requests (thanks to proxy)
6. **Fast**: No runtime environment detection

## Edge Cases

### Different Backend Domain

If backend is on a different domain (rare), create `.env.production.local`:

```bash
# Only needed if backend is NOT on same domain
VITE_API_URL=https://api.example.com
```

This file is gitignored and machine-specific.

### Multiple Environments

Use Vite modes:

```bash
# Custom mode
vite build --mode staging

# Create .env.staging
VITE_API_URL=https://staging-api.example.com
```

## Testing

```bash
# 1. Test development
docker compose up frontend-dev backend-dev
curl http://localhost:5153/api/task/subjects
# Should return subjects list

# 2. Test local production
docker compose build frontend-prod backend-prod
docker compose up frontend-prod backend-prod
curl http://localhost:5154/api/task/subjects
# Should return subjects list

# 3. Test on server
# Deploy as per DEPLOYMENT.md
curl https://yourdomain.com/api/task/subjects
# Should return subjects list
```

## Troubleshooting

### Frontend shows 404 for API calls

**Development:**
```bash
# Check Vite proxy config
grep -A 5 "proxy:" packages/frontend/vite.config.ts

# Check backend is running
docker compose ps backend-dev
```

**Production:**
```bash
# Check Nginx config
docker compose exec frontend-prod cat /etc/nginx/conf.d/default.conf | grep -A 5 "location /api"

# Check backend is reachable
docker compose exec frontend-prod wget -O- http://backend-prod:3000/api/task/subjects
```

### API calls work in dev but not prod

```bash
# 1. Verify Nginx config was copied
docker compose exec frontend-prod ls -la /etc/nginx/conf.d/

# 2. Check Nginx logs
docker compose logs frontend-prod

# 3. Rebuild frontend-prod
docker compose build --no-cache frontend-prod
docker compose restart frontend-prod
```

## Best Practices

1. ✅ Keep `.env.development` and `.env.production` in git (no secrets, just empty VITE_API_URL)
2. ✅ Use `.env.local` or `.env.*.local` for machine-specific overrides (gitignored)
3. ✅ Never hardcode URLs in code
4. ✅ Always use relative URLs unless absolutely necessary
5. ✅ Test both dev and prod configurations locally before deploying
