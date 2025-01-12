const express = require('express');
const router = express.Router();
const db = require('./db');

// router.post('/', (req, res) => {
//     const { name, category, base_price, description, allergens, is_available } = req.body;

//     if (!name || !category || base_price == null) {
//         return res.status(400).json({ error: 'Name, category, and base price are required' });
//     }

//     const query = `
//         INSERT INTO dishes (name, category, base_price, description, allergens, is_available, popularity_score)
//         VALUES (?, ?, ?, ?, ?, ?, ?)
//     `;
//     const allergensJson = JSON.stringify(allergens || []);
//     db.query(
//         query,
//         [name, category, base_price, description || '', allergensJson, is_available || true, 0],
//         (err, result) => {
//             if (err) {
//                 console.error('Error adding dish:', err);
//                 return res.status(500).json({ error: 'Failed to add dish' });
//             }
//             res.status(201).json({ message: 'Dish added successfully!', dish_id: result.insertId });
//         }
//     );
// });

router.get('/', (req, res) => {
    const query = 'SELECT * FROM dishes';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching dishes:', err);
            return res.status(500).json({ error: 'Failed to fetch dishes' });
        }
        // console.log(results);
        res.status(200).json(results);
    });
});

router.post('/', (req, res) => {
    const { dishId } = req.body; // Get the dishId from the request body
    const query = 'SELECT * FROM dishes WHERE dish_id = ?'; // Correct query syntax
    db.query(query, [dishId], (err, results) => {
      if (err) {
        console.error('Error fetching dishes:', err);
        return res.status(500).json({ error: 'Failed to fetch dishes' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Dish not found' }); // Handle case if no dish is found
      }
  
    //   console.log('Dish found:', results[0]); // Log the found dish
      res.status(200).json(results[0]); // Send the first result (assuming dish_id is unique)
    });
  });

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, base_price, description, allergens, is_available } = req.body;
    const query = `
        UPDATE dishes 
        SET name = ?, category = ?, base_price = ?, description = ?, allergens = ?, is_available = ?
        WHERE dish_id = ?
    `;
    const allergensJson = JSON.stringify(allergens || []);
    db.query(
        query,
        [name, category, base_price, description, allergensJson, is_available, id],
        (err, result) => {
            if (err) {
                console.error('Error updating dish:', err);
                return res.status(500).json({ error: 'Failed to update dish' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Dish not found' });
            }
            res.status(200).json({ message: 'Dish updated successfully!' });
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM dishes WHERE dish_id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting dish:', err);
            return res.status(500).json({ error: 'Failed to delete dish' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Dish not found' });
        }
        res.status(200).json({ message: 'Dish deleted successfully!' });
    });
});

module.exports = router;
