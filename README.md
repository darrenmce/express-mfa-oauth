## OAuth 2 server

####

First target:
  - registration with QRcode for authenticator apps (MFA)
  - `authorization_code` and `password` grants
  - mfa extension grant for password grant
  - token provisioning
  - Redis backend

### Getting Started

- Run `npm run build && npm start` to get the server running.
- Or for dev mode, `npm run dev`
- Optionally create a `.oauth-serverrc` rc configuration file, which is described in [src/config.index.ts](./src/config/index.ts "OAuth Server Configuration")

### Example test client

- See https://github.com/darrenmce/oauth2-test-client
