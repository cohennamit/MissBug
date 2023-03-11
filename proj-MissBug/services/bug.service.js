const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
    query,
    getById,
    remove,
    save
}


const PAGE_SIZE = 3

function query(filterBy = { title: '', page: 0 }) {
    const regex = new RegExp(filterBy.title, 'i')
    var bugs = gBugs.filter(bug => regex.test(bug.title))

    if (filterBy.page) {
        const startIdx = filterBy.page * PAGE_SIZE
        bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
    }

    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = gBugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('Unknown bug')
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = gBugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('Unknown bug')
    gBugs.splice(idx, 1)
    // return Promise.resolve()
    return _saveBugsToFile()
}

function save(bug, loggedinUser) {
    var savedBug
    if (bug._id) {
        savedBug = gBugs.find(currBug => currBug._id === bug._id)
        if (!savedBug) return Promise.reject('Unknown bug')
        savedBug.title = bug.title
        savedBug.description = bug.description
        savedBug.severity = bug.severity
        savedBug.createdAt = bug.createdAt
        // return Promise.resolve(existingBug)
    } else {
        savedBug = {
            _id: _makeId(),
            owner: loggedinUser,
            title: bug.title,
            description: bug.description,
            severity: bug.severity,
            createdAt: Date.now()
        }
        console.log('savedBug', savedBug)
        gBugs.push(savedBug)
        // return Promise.resolve(bug)
    }
    return _saveBugsToFile().then(() => {
        return savedBug
    })
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
