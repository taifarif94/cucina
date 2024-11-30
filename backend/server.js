const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const loginRoutes = require('./server/login');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', loginRoutes);

app.post('/api/google-login',)

app.post('/api/orders', (req, res) => {
    const order = req.body;
    console.log('Order Received:', order);
    res.status(200).json({ message: 'Order placed successfully!', order });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
