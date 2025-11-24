# CallDash Server

Node.js backend server for the CallDash voice agent application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API keys if needed.

## Running

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3001 (or the PORT specified in .env).

## Deploying to Replit

1. Create a new Repl on Replit
2. Choose "Node.js" as the template
3. Upload all files from this `server` folder to your Repl
4. In the Replit "Secrets" tab (lock icon), add your environment variables:
   - `PORT=3001`
   - `ULTRAVOX_API_KEY=your_key_here`
   - `HINDI_AGENT_ID=your_id_here`
   - `LIVEKIT_API_KEY=your_key_here`
   - `LIVEKIT_API_SECRET=your_secret_here`
   - `LIVEKIT_URL=your_url_here`
   - `ENGLISH_AGENT_ID=your_id_here`

5. Click "Run" button in Replit

6. Once running, Replit will give you a public URL like `https://your-repl-name.your-username.repl.co`

7. Update your frontend `.env` file to point to this URL:
   ```
   VITE_API_URL=https://your-repl-name.your-username.repl.co
   ```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Create Call
```
POST /api/create-call
Content-Type: application/json

{
  "language": "hindi" | "english"
}
```
Creates a new voice call and returns connection details.
