# start-from-scratch-codex

## Environment Variables

Copy `.env.example` to `.env` and adjust the values as needed. The client recognizes the following variable:

```
VITE_API_URL=http://localhost:3001
```

`VITE_API_URL` sets the base URL for API requests from the client. If it is not defined, the client will use the same origin as the loaded page.


