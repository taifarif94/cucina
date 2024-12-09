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

    const dishQuery = `SELECT dish_id, base_price FROM dishes WHERE dish_id IN (?)`;
    db.query(dishQuery, [dishIds], (err, dishResults) => {
        if (err) {
            console.error('Error fetching dishes:', err);
            return res.status(500).json({ error: 'Failed to calculate total price' });
        }

        const dishMap = dishResults.reduce((map, dish) => {
            map[dish.dish_id] = dish.base_price;
            return map;
        }, {});

        dishes.forEach(dish => {
            if (dishMap[dish.dish_id]) {
                total_price += parseFloat(dishMap[dish.dish_id]);
            }
        });

        const orderQuery = `INSERT INTO orders (user_id, total_price, order_status) VALUES (?, ?, ?)`;
        db.query(orderQuery, [user_id, total_price, 'pending'], (err, orderResult) => {
            if (err) {
                console.error('Error creating order:', err);
                return res.status(500).json({ error: 'Failed to create order' });
            }

            const orderId = orderResult.insertId;
            const customizations = dishes.flatMap(dish =>
                (dish.customizations || []).map(customization => [
                    orderId,
                    dish.dish_id,
                    customization.ingredient_id,
                    customization.action
                ])
            );

            if (customizations.length > 0) {
                const customizationQuery = `
                    INSERT INTO customizations (order_id, dish_id, ingredient_id, action)
                    VALUES ?
                `;
                db.query(customizationQuery, [customizations], (err) => {
                    if (err) {
                        console.error('Error adding customizations:', err);
                        return res.status(500).json({ error: 'Failed to add customizations' });
                    }
                    res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
                });
            } else {
                res.status(201).json({ message: 'Order placed successfully', order_id: orderId });
            }
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
