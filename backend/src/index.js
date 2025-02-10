const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());



app.use('/api/users', require('./routes/users.routes'));
app.use('/api/dresses', require('./routes/dresses.routes'));
app.use('/api/jewelry', require('./routes/jewelry.routes'));
app.use('/api/sells', require('./routes/sells.routes'));
app.use('/api/rents', require('./routes/rents.routes'));

app.use('/dresses', express.static(path.join(__dirname, '..' , 'public', 'images', 'vestidos' )));
app.use('/jewelry', express.static(path.join(__dirname, '..' , 'public', 'images', 'joyeria' )));

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db.dbConnect();
});
