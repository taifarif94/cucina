export const menuConfig = {
  foodOptions: {
    Protein: {
      Beef: ["Ribeye", "T-Bone", "Sirloin", "Tenderloin", "Flank", "Chuck", "Brisket", "Short Ribs", "Top Round", "Filet Mignon"],
      Chicken: ["Breast", "Thigh", "Wings", "Drumsticks", "Whole Chicken", "Ground Chicken", "Chicken Tenders"],
      Fish: ["Salmon", "Tuna", "Sea Bass", "Cod", "Haddock", "Mackerel", "Halibut", "Trout", "Sardines"]
    },
    Starch: ["Mashed Potatoes", "Sweet Potatoes", "French Fries", "Baked Potatoes", "Hash Browns", "Polenta", "Plantains", "Gnocchi"],
    Grain: ["Rice", "Quinoa", "Couscous", "Barley", "Farro", "Millet", "Buckwheat", "Oats", "Bulgur"],
    Spices: ["Salt", "Black Pepper", "Garlic Powder", "Onion Powder", "Paprika", "Cayenne", "Italian Herbs", "Cajun Seasoning", "Lemon Pepper"],
    Condiments: {
      Sauces: ["Ketchup", "Mustard", "Mayo", "BBQ Sauce", "Hot Sauce", "Ranch", "Honey Mustard", "Teriyaki"],
      Toppings: ["Sautéed Onions", "Sautéed Mushrooms", "Caramelized Onions", "Garlic Butter"],
      Garnish: ["Fresh Herbs", "Lemon Wedge", "Lime Wedge", "Chopped Parsley"]
    }
  },
  cookingMethods: {
    Beef: ["Grilled", "Pan-Seared", "Broiled", "Sous Vide", "Braised", "Roasted", "Slow-Cooked", "Smoked", "Stewed"],
    Chicken: ["Roasted", "Grilled", "Pan-Fried", "Baked", "Poached", "Deep-Fried", "Stir-Fried", "Smoked", "Braised"],
    Fish: ["Grilled", "Pan-Seared", "Baked", "Steamed", "Poached", "Smoked", "Deep-Fried", "Broiled", "Ceviche"],
    Starch: ["Roasted", "Fried", "Mashed", "Boiled", "Gratin", "Steamed", "Sautéed", "Baked"],
    Grain: ["Steamed", "Pilaf", "Boiled", "Risotto", "Fried Rice", "Stuffed", "Casserole", "Salad"]
  },
  temperatures: [
    "Rare", "Medium Rare", "Medium", "Medium Well", "Well Done",
    "Blue Rare", "Extra Rare", "Warm Rare", "Medium-Rare Plus", "Charred"
  ],
  // Space requirements for different types of items
  spaceRequirements: {
    Beef: {
      "Ribeye": 4,
      "T-Bone": 4,
      "Sirloin": 4,
      "Tenderloin": 4,
      "Flank": 4,
      "Chuck": 4,
      "Brisket": 4,
      "Short Ribs": 4,
      "Top Round": 4,
      "Filet Mignon": 4
    },
    default: 1 // All other items take up 1 space by default
  }
};