# Basic slack clone
Inlcudes server and client. Websockets are used for sending and receiveing messages on a channel. 
Only basic features such as workspaces, channels and messages are implemented.


## Setup

### Server
Express.js for api
Ws package for websocket server
- `cd server`
- `npm i && npm run dev`

### Client
Uses vite for build. 
Tailwind for styles
Shadcn for core components
- `cd client`
- `npm i && npm run dev`