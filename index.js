var express = require('express');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/api', (req, res) => {
    res.json({
        text: 'my api!'
    })
    // res.send(`
    // <html>
    //     <body>
    //         <p>Ez a tokened</p>
    //         <p>${token}</p>
    //         <form action="/api/login" method="POST">
    //             <input name="szoveg" type="text" placeholder="Adj tokent!" />
    //             <button type="submit">Küldés</button>
    //         </form>
    //     </body>
    // </html>
    // `)
})

app.post('/api/login', function (req, res) {
    //auth user
    const user = { id: 777 };
    const token = jwt.sign({ user }, 'my_secret_key');
    res.json({
        'Ez a tokened': token
    })
})

app.get('/api/protected', ensureToken, (req, res) => {
    jwt.verify(req.token, 'my_secret_key', (err, data) => {
        if (err) {
            console.log(err)
            res.sendStatus(403);
        } else {
            res.json({
                text: 'A levédett api elérve!',
                data: data
            })
        }
    })
})

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.listen(3005, () => {
    console.log('App listening on port 3005!')
});