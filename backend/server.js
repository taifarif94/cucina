const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoutes = require('./server/login');
const itemRoutes = require('./server/item');
const orderRoutes = require('./server/order');
const dishRoutes = require('./server/dishes');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/login', loginRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/dish', dishRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
