# [Alain.xyz](https://alain.xyz) Daemon

A **Continuous Delivery** service that automatically updates the server from github push events.

## How It Works

Github sends a push event to an endpoint on `https://alain.xyz/api/v1/github`, which is mapped to the daemon on nginx.

```nginx
location /api/v1/github {
        proxy_pass http://localhost:3030;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

The daemon in turn:

1. Does an HMAC SHA1 check to verify that this was indeed github. 
2. `git pull` the repo.
3. `npm start` if the push event included files in the portfolio (by checking `head_commit.modified`).
4. `pkill node && npm start` if the push event included files in the backend.
5. `npm start` if the push event included files in the frontend.