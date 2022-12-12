const express = require('express');
const app = express();
const router = require('./routes')
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send("Final Project 2");
})

app.use(router);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`App running on PORT ${PORT}`);
    });
}

module.exports = app;