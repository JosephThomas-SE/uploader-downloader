const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false}));

const users = [
    { username: 'uploader', password: 'uploaderPass', role: 'uploader'},
    { username: 'downloader', password: 'downloaderPass', role: 'downloader'}
];

app.use((req, res, next) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if(!user){
        return res.status(401).send('Authentication failed');
    }
    req.user = user;
    next();
});

function authorize(role) {
    return(req, res, next) => {
        if (req.user.role === role){
            next();
        } else {
            res.status(403).send('Access denied');
        }
    };
}

app.get('/upload',
authorize('uploader'), (req, res) => {res.send('/uploader.html');
});

app.get('/download',
authorize('downloader'), (req, res) => {res.send('downloader.html');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});