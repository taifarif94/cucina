const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/', (req, res) => {
    const { user_id, dishes } = req.body;

    if (!user_id || !Array.isArray(dishes) || dishes.length === 0) {
        return res.status(400).json({ error: 'User ID and dishes are required' });
    }

    let total_price = 0.0;
    const dishIds = dishes.map(dish => dish.dish_id);
    const beverageIds = dishes.map(dish => dish.beverages).filter(Boolean); // Only valid beverage IDs

    const dishQuery = `SELECT * FROM dishes WHERE dish_id IN (?)`;
    const beverageQuery = `SELECT beverage_id, price FROM beverages WHERE beverage_id IN (?)`;

    // Fetch dishes and beverages prices in parallel
    db.query(dishQuery, [dishIds], (err, dishResults) => {
        if (err) {
            console.error('Error fetching dishes:', err);
            return res.status(500).json({ error: 'Failed to calculate total price' });
        }

        db.query(beverageQuery, [beverageIds], (err, beverageResults) => {
            if (err) {
                console.error('Error fetching beverages:', err);
                return res.status(500).json({ error: 'Failed to calculate total price' });
            }

            const dishMap = dishResults.reduce((map, dish) => {
                map[dish.dish_id] = dish.price;
                return map;
            }, {});

            const beverageMap = beverageResults.reduce((map, beverage) => {
                map[beverage.beverage_id] = beverage.price;
                return map;
            }, {});

            // Insert order into orders table
            const orderQuery = `INSERT INTO orders (user_id, total_price, order_status) VALUES (?, ?, ?)`;

            db.query(orderQuery, [user_id, total_price, 'pending'], (err, orderResult) => {
                if (err) {
                    console.error('Error creating order:', err);
                    return res.status(500).json({ error: 'Failed to create order' });
                }

                const orderId = orderResult.insertId;

                // Process each dish and insert into order_items table
                const orderItems = dishes.map(dish => {
                    const dishPrice = dishMap[dish.dish_id] || 0;
                    const beveragePrice = beverageMap[dish.beverages] || 0;
                    const itemPrice = dishPrice + beveragePrice;
                    total_price += itemPrice;

                    return [
                        orderId,
                        dish.dish_id,
                        dish.beverages || null,
                        // dish.add_ons.join(', '), // Convert add_ons array to string
                        // dish.quantity,
                        itemPrice
                    ];
                });

                const orderItemsQuery = `
                    INSERT INTO order_items (order_id, dish_id, beverage_id, price)
                    VALUES ?
                `;
                console.log(orderItems);
                db.query(orderItemsQuery, [orderItems], (err) => {
                    if (err) {
                        console.error('Error inserting order items:', err);
                        return res.status(500).json({ error: 'Failed to add order items' });
                    }

                    // Update the total price in the orders table
                    const updateOrderQuery = `UPDATE orders SET total_price = ? WHERE order_id = ?`;
                    db.query(updateOrderQuery, [total_price, orderId], (err) => {
                        if (err) {
                            console.error('Error updating total price:', err);
                            return res.status(500).json({ error: 'Failed to update order total price' });
                        }

                        res.status(201).json({
                            message: 'Order placed successfully',
                            order_id: orderId
                        });
                    });
                });
            });
        });
    });
});


router.get('/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM orders WHERE order_id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching order status:', err);
            return res.status(500).json({ error: 'Failed to fetch order status' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json(results[0]);
    });
});

router.put('/:id/status', (req, res) => {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!order_status) {
        return res.status(400).json({ error: 'Order status is required' });
    }

    const query = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
    db.query(query, [order_status, id], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Failed to update order status' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated successfully!' });
    });
});

router.get('/:id/bill', (req, res) => {
    const { id } = req.params;

    const query = `SELECT total_price FROM orders WHERE order_id = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching order bill:', err);
            return res.status(500).json({ error: 'Failed to fetch order bill' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ total_price: results[0].total_price });
    });
});

module.exports = router;
