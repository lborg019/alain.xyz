# [Alain.xyz](https://alain.xyz) Daemon

A service that automatically updates the server from github push events.

## How It Works

This repo receives push events at `https://alain.xyz/api/v1/github`, a route that's mapped by nginx to this Daemon.

```
location /api/v1/github {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

Which receives the events, and:

1. `git pull` the repo.
2. `lerna run build` to build bundles, populate database with changes.
3. `npm start` to start the server.