const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) =>
    res.render('../index.ejs')
)

app.listen(5555, console.log(`Server running on 5555`));