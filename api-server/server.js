const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json());

app.use(cors({
    origin: '*'
}))

const NORMAL_TOKEN_OPTION = 1
const ADMIN_TOKEN_OPTION = 2

const NORMAL_USER = {
    name: 'kunal',
    admin: false
}

const ADMIN_USER = {
    name: 'alex',
    admin: true
}

const SECRET = 'client-secret'

app.get('/', (req, res) => {
    res.send('hello')
})

app.post('/access_token', (req, res) => {

    const { value } = req.body;


    switch(value) {
        case 1:
            jwt.sign(NORMAL_USER, SECRET, (err, token) => {
                res.json({accessToken: token})
            })
            break;
        case 2:
            jwt.sign(ADMIN_USER, SECRET, (err, token) => {
                res.json({accessToken: token})
            })
            break;
        default:
            res.json({error: 'Please send a valid option'})
    }

    

    


})


app.get('/public_api', (req, res) => {
    res.send('Public API called')
})

app.get('/private_api', (req, res) => {

    // console.log(req.headers.authorization)
    const auth_header = req.headers.authorization;
    if(!auth_header)  res.send(401, 'Unauthorized request')

    const accessToken = auth_header.split(' ')[1]

    jwt.verify(accessToken, SECRET, (err, payload) => {
        // console.log(err)
        if (err) res.send(401, 'Unauthorized request')


        res.send('Private API called')
    })
        
        
    


    // res.send('Public API called')
})

app.get('/restricted_api', (req, res) => {

    const auth_header = req.headers.authorization;
    if(!auth_header)  res.send(401, 'Unauthorized request')

    const accessToken = auth_header.split(' ')[1]

    jwt.verify(accessToken, SECRET, (err, user) => {
        // console.log(err)
        if (err) res.send(401, 'Unauthorized request')

        if (user.admin == true) res.send('Restricted API called')

        res.send(401, 'Unauthorized request')

    })

})


const PORT = 8000
app.listen(PORT, () => {
    console.log('Listening on port', PORT);
})