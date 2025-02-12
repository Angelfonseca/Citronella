const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
const ensureAuth = require('./middlewares/auth.middleware');

app.use('/api/test', (req, res) => {
    res.send('Hello from Express');
});

app.use('/api/users', require('./routes/users.routes'));
app.use('/api/dresses', ensureAuth.ensureAuth,require('./routes/dresses.routes'));
app.use('/api/jewelry', ensureAuth.ensureAuth,require('./routes/jewelry.routes'));
app.use('/api/sells', ensureAuth.ensureAuth,require('./routes/sells.routes'));
app.use('/api/rents', ensureAuth.ensureAuth,require('./routes/rents.routes'));

// Middleware to check token in query parameter for image access
const checkTokenQueryParam = (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        ensureAuth.verifyToken(token);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

app.use('/api/images/dresses', checkTokenQueryParam, express.static(path.join(__dirname, '..', 'public', 'images', 'vestidos')));
app.use('/api/images/jewelry', checkTokenQueryParam, express.static(path.join(__dirname, '..', 'public', 'images', 'joyeria')));

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    db.dbConnect();
});
