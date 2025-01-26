import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "./dish_cards";

const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [recommendedData, setRecommendedData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const filterData = localStorage.getItem("filter_data");

  // Helper function to parse allergens
  const parseAllergens = (allergens) => {
    if (!allergens) return "None";
    try {
      // If it's a string that looks like an array, parse it
      if (typeof allergens === 'string' && allergens.startsWith('[')) {
        const parsed = JSON.parse(allergens);
        return parsed.join(', ');
      }
      // If it's already an array
      if (Array.isArray(allergens)) {
        return allergens.join(', ');
      }
      // If it's a plain string
      return allergens;
    } catch (e) {
      console.error('Error parsing allergens:', e);
      return allergens;
    }
  };

  // Process recommended data
  useEffect(() => {
    if (filterData) {
      try {
        const parsedData = JSON.parse(filterData);
        const processedData = parsedData.map(item => ({
          ...item,
          allergens: parseAllergens(item.allergens),
          // Use base_price if price is undefined
          price: item.price || item.base_price || null
        }));
        setRecommendedData(processedData);
      } catch (e) {
        console.error("Error parsing content_based_filter:", e);
      }
    }
  }, [filterData]);

  // Fetch and process all dishes
  useEffect(() => {
    // In home.js, update the fetchDishes function:
const fetchDishes = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/dish");
        const data = await response.json();
        console.log("Raw API response:", data);
        
        const processedDishes = data.map(dish => {
            console.log("Processing dish:", dish.name);
            console.log("Dish beverages before processing:", dish.recommended_beverage);
            
            return {
                ...dish,
                allergens: parseAllergens(dish.allergens),
                // Ensure recommended_beverage is preserved
                recommended_beverage: dish.recommended_beverage || []
            };
        });
        
        console.log("Final processed dishes:", processedDishes);
        setDishes(processedDishes);
    } catch (error) {
        console.error("Error fetching dishes:", error);
        setError("Failed to load dishes. Please try again later.");
    }
};

    fetchDishes();
  }, []);

  const getDishImageUrl = (dishName) => {
    if (!dishName) return "https://via.placeholder.com/300x200";
    const fileName = dishName.toLowerCase().replace(/ /g, '_') + '.jpg';
    return `/images/${fileName}`;
  };

  const formatContent = (dish) => {
    const category = dish.food_category || dish.category || '';
    const allergenText = dish.allergens === 'None' ? 'No Allergens' : `Allergens: ${dish.allergens}`;
    const priceText = dish.price ? `$${parseFloat(dish.price).toFixed(2)}` : 'Price on request';

    return `${category}
• ${allergenText}
• ${priceText}`;
  };

// In the Card click handler in home.js:
const handleCardClick = async (dishId) => {
    try {
        console.log("Fetching full dish data for:", dishId);
        const response = await axios.post("http://localhost:5000/api/dish", {
            dishId,
        });
        console.log("Full dish data received:", response.data);
        
        if (response.data) {
            navigate("/plate", { 
                state: { 
                    dish_data: response.data
                } 
            });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        setError("An error occurred while processing the request.");
    }
};

  const renderDishCard = (dish) => (
    <div
      key={dish.dish_id}
      className="transform transition duration-300 hover:scale-105"
    >
      <Card
        title={dish.name}
        imageUrl={getDishImageUrl(dish.name)}
        imageAlt={dish.name}
        content={formatContent(dish)}
        dish_id={dish.dish_id}
        onCardClick={handleCardClick}
        className="h-full bg-white rounded-lg shadow-lg overflow-hidden"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Our Menu
        </h1>
        
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/plate')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
          >
            Build Your Own Plate
          </button>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">
            Recommended For You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedData && recommendedData.length > 0 ? (
              recommendedData.map(renderDishCard)
            ) : (
              <p className="text-gray-600 col-span-full text-center py-8">
                Complete the survey to get personalized recommendations!
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-blue-500">
            All Dishes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes && dishes.length > 0 ? (
              dishes.map(renderDishCard)
            ) : (
              <p className="text-gray-600 col-span-full text-center py-8">
                No dishes available at the moment.
              </p>
            )}
          </div>
        </section>

        {error && (
          <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;