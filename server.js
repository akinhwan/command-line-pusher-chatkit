const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('@pusher/chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:7be87603-60cd-4e6b-85b0-70ab230a991e',
  key:
    '717d7890-622a-4398-9f83-c9a88bfabe98:snEzz/GmHfcjUiAfMk1xOiySuNerc6Qb9j0edVVLt8Q='
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log(`User created: ${username}`)
      res.sendStatus(201)
    })
    .catch(err => {
      if (err.error === 'services/chatkit/user_already_exists') {
        console.log(`User already exists: ${username}`)
        res.sendStatus(200)
      } else {
        res.status(err.status).json(err)
      }
    })
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})

const port = 3001
app.listen(port, err => {
  if (err) {
    console.log(err)
  } else {
    console.log(`Running on port ${port}`)
  }
})