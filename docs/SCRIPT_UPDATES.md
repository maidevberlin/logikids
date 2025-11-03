# Deployment Scripts - Migration Guide

## Summary of Changes

All deployment scripts have been updated to align with the new professional URL/port configuration system.

## Key Changes

### Port Updates

**Old Configuration:**
- Frontend prod: `5174`
- Backend prod: `5176`

**New Configuration:**
- Frontend prod: `5154`
- Backend prod: `5176` (unchanged)

### Architecture Change

**Old Approach (WRONG):**
```
Host Nginx → Frontend (5154) for static files
           → Backend (5176) for /api
```

**New Approach (CORRECT):**
```
Host Nginx → Frontend Container (5154) → Nginx inside container
                                        → Static files
                                        → /api → Backend (3000 internally)
```

## Updated Scripts

### 1. `install.sh`

**Changes:**
- Updated frontend port from `5174` → `5154`
- Added explanation that frontend proxies `/api` automatically

**Why:**
- Reflects correct port mapping
- Clarifies that API proxying is built-in

### 2. `restart.sh`

**Changes:**
- Updated frontend port from `5174` → `5154`
- Added explanation about automatic API proxying

**Why:**
- Consistent port references
- User education about architecture

### 3. `setup-nginx.sh` (MAJOR CHANGE)

**Old Configuration:**
```nginx
location / {
    proxy_pass http://localhost:5154;
}

location /api/ {
    proxy_pass http://localhost:5176;  # ❌ WRONG
}
```

**New Configuration:**
```nginx
location / {
    proxy_pass http://localhost:5154;  # ✅ Everything goes to frontend
}
# Frontend container's Nginx handles /api internally
```

**Why this matters:**
1. **Single entry point** - Host Nginx only knows about frontend container
2. **Encapsulation** - Backend is hidden behind frontend container
3. **Consistent architecture** - Same pattern in dev, local prod, and server
4. **Better separation** - Frontend container manages its own routing

### 4. `configure.sh`

**Changes:**
- No changes needed (backend config is internal)

**Why:**
- Backend configuration is environment-agnostic
- Port 3000 is internal to Docker network

### 5. `update.sh`

**Changes:**
- No changes needed

**Why:**
- Just wraps `restart.sh` which was already updated

## Migration Guide for Existing Deployments

If you have an existing server deployment, follow these steps:

### Step 1: Update the Code

```bash
cd /path/to/logikids
git pull
```

### Step 2: Rebuild Frontend with New Nginx Config

```bash
docker compose build --no-cache frontend-prod
```

**Critical:** The `--no-cache` flag ensures the new `nginx.conf` is included.

### Step 3: Update Host Nginx Configuration

```bash
sudo ./setup-nginx.sh
```

This will regenerate the Nginx config with the correct proxy settings.

### Step 4: Restart Containers

```bash
./restart.sh
```

### Step 5: Verify

```bash
# Test static files
curl https://yourdomain.com/

# Test API
curl https://yourdomain.com/api/task/subjects

# Both should work
```

## Testing Locally

Before deploying to server, test the new configuration locally:

```bash
# Build production containers
docker compose build --no-cache frontend-prod backend-prod

# Start them
docker compose up -d frontend-prod backend-prod

# Test frontend
curl http://localhost:5154/

# Test API through frontend
curl http://localhost:5154/api/task/subjects

# Should return subjects list
```

## Troubleshooting

### Frontend serves static files but /api returns 404

**Problem:** Frontend container doesn't have the new nginx.conf

**Solution:**
```bash
docker compose build --no-cache frontend-prod
docker compose up -d frontend-prod
```

### SSL certificate errors

**Problem:** Domain changed or certificate expired

**Solution:**
```bash
sudo certbot renew
sudo systemctl restart nginx
```

### Backend not reachable from frontend container

**Problem:** Docker network issue

**Solution:**
```bash
docker compose down
docker compose up -d frontend-prod backend-prod
```

Check logs:
```bash
docker compose logs frontend-prod | grep "proxy"
docker compose logs backend-prod
```

## Architecture Diagram

### Old (Incorrect)
```
Internet → Host Nginx:443
              ├→ / → Frontend Container:5154 (static files)
              └→ /api → Backend Container:5176 ❌
```

### New (Correct)
```
Internet → Host Nginx:443
              └→ / → Frontend Container:5154
                        ├→ static files (Nginx)
                        └→ /api → Backend Container:3000 ✅
```

## Benefits

1. **Simpler host configuration** - Host Nginx only proxies to one service
2. **Better encapsulation** - Backend is internal to Docker network
3. **Consistent patterns** - Same architecture everywhere
4. **Easier debugging** - Frontend container logs show all API proxy activity
5. **More secure** - Backend not exposed directly to host

## Files Modified

- ✅ `install.sh` - Updated port and added explanation
- ✅ `restart.sh` - Updated port and added explanation
- ✅ `setup-nginx.sh` - **Major change** - Removed direct backend proxy
- ✅ `configure.sh` - No changes needed
- ✅ `update.sh` - No changes needed

## Related Documentation

- `DEPLOYMENT.md` - Full deployment guide
- `docs/URL_CONFIGURATION.md` - Technical details on URL/port config
- `CLAUDE.md` - Updated with new ports
