const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const steakMenu = {
  steaks: ['Ribeye', 'T-Bone', 'Sirloin', 'Tenderloin', 'Flank'],
  cookingMethods: ['Grilled', 'Fried', 'Boiled', 'Pan-Seared', 'Sous Vide'],
  sauces: ['BBQ', 'Peppercorn', 'Mushroom', 'Garlic Butter', 'Chimichurri'],
  sides: ['Fries', 'Salad', 'Mashed Potatoes', 'Rice', 'Grilled Veggies'],
};

app.get('/menu', (req, res) => {
  res.json(steakMenu);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
