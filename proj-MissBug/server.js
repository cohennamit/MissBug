const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World')
})

// Bug API

app.get('/api/bug', (req, res) => {
    console.log('req.query', req.query)
    const filterBy = {
        title: req.query.title || '',
        page: req.query.page || 0,

    }
    bugService.query(filterBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot load bugs')
        })
})

app.put('/api/bug/:bugId', (req, res) => {
    const { _id, title, description, severity } = req.body
    const bug = { _id, title, description, severity }

    // const bug = {
    //     // _id: "b103",
    //     _id: req.query._id || null,
    //     title: req.query.title || "Cannot load new bug",
    //     description: req.query.description || "problem with adding a bug",
    //     severity: +req.query.severity || 2,
    //     createdAt: Date.now()
    // }

    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Can\'t save bug, Error:', err)
            res.status(400).send('Can\'t save bug')
        })
})

app.post('/api/bug', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { title, description, severity } = req.body
    const bug = { title, description, severity, createdAt: Date.now() }
    console.log('bug', bug)

    const user = userService.validateToken(req.cookies.loginToken)
    console.log('bug is added by:', user);


    bugService.save(bug, loggedinUser)
        .then(savedBug => {
            res.send(savedBug)
        })
        .catch(err => {
            console.log('Can\'t save bug, Error:', err)
            res.status(400).send('Can\'t save bug')
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    var visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3) return res.status(401).send('Wait for a bit.')
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot load bug')
        })
})

app.delete('/api/bug/:bugId/', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => {
            res.send('Deleted successfully')
        })
        .catch((err) => {
            console.log('OOPS:', err)
            res.status(400).send('Cannot remove bug')
        })
})

// Users

app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load users')
        })

})

app.put('/api/user/:userId', (req, res) => {
    const { _id, username, fullname, password } = req.body
    const user = { _id, username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.post('/api/user', (req, res) => {
    const { username, fullname, password } = req.body
    const user = { username, fullname, password }

    userService.save(user)
        .then(savedUser => {
            res.send(savedUser)
        })
        .catch(err => {
            console.log('Cannot save user, Error:', err)
            res.status(400).send('Cannot save user')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.remove(userId)
        .then(() => {
            res.send('OK, deleted')
        })
        .catch((err) => {
            console.log('Error:', err)
            res.status(400).send('Cannot remove user')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout')
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})



const port = process.env.PORT || 3031
app.listen(port, () => {
    console.log(`Bug app listening on: http://localhost:${port}`)
})