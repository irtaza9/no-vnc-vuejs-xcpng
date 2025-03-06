const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const WebSocket = require('ws')

const app = express()
const PORT = 3000
const DOMAIN = 'localhost'
const XO_WS_URL = `ws://${DOMAIN}/api/`

/* 
 XO credentials (replace with your own)
 You can take these from your custom web portal 
 but there must be a user with same credentials in XO
*/
const USERNAME = "******" 
const PASSWORD = "******"

app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5172',  
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization']
}))


let ws = null
let isAuthenticated = false

// Function to establish a WebSocket connection and authenticate
async function connectToXO() {
  return new Promise((resolve, reject) => {
    ws = new WebSocket(XO_WS_URL)

    ws.on('open', () => {
      console.log("Connected to XO WebSocket")
      
      // Authenticate
      const authRequest = {
        id: Date.now(),
        jsonrpc: '2.0',
        method: 'session.signIn',
        params: { username: USERNAME, password: PASSWORD }
      }
      ws.send(JSON.stringify(authRequest))
    })

    ws.on('message', (data) => {
      const response = JSON.parse(data)

      if (response.result && response.result.id) {
        isAuthenticated = true
        console.log("Authenticated successfully:", response.result)
        resolve()
      } else {
        reject(new Error("Authentication failed"))
      }
    })

    ws.on('error', (err) => reject(err))
    ws.on('close', () => {
      console.log("WebSocket connection closed")
      ws = null
      isAuthenticated = false
    })
  })
}

// Function to request a temporary console token
async function requestConsoleToken(vmId) {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return reject(new Error("WebSocket is not connected"))
    }
    
    if (!isAuthenticated) {
      return reject(new Error("Not authenticated"))
    }

    const request = {
      id: Date.now(),
      jsonrpc: '2.0',
      method: 'token.create',
      params: { description: `token to access the console for -> ${vmId} by this -> ${USERNAME}` }
    }
    ws.send(JSON.stringify(request))

    ws.on('message', (data) => {
      const response = JSON.parse(data)
      if (response.result) {
        resolve(response.result)
      } else {
        reject(new Error("Failed to generate console token"))
      }
    })

    ws.on('error', (err) => reject(err))
  })
}

// API to generate console token securely
app.post('/api/generate-console-token', async (req, res) => {
  try {
    const { vmId } = req.body

    if (!ws || ws.readyState !== WebSocket.OPEN || !isAuthenticated) {
      console.log("Re-authenticating to XO...")
      await connectToXO()
    }

    const consoleToken = await requestConsoleToken(vmId)

    // Set token as a cookie for cxoa.nayatel.com
    res.cookie('token', consoleToken, {
      domain: DOMAIN,
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    })

    // Return console URL
    res.json({ success: true, consoleUrl: `${XO_WS_URL}consoles/${vmId}` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
