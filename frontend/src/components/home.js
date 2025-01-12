import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "./dish_cards"; // Card Component

const HomePage = () => {
  const [dishes, setDishes] = useState([]); // State to store all dishes
  const [recommendedData, setRecommendedData] = useState([]); // State to store recommended dishes
  const [error, setError] = useState(""); // State for error]
  const navigate = useNavigate();
  const filterData = localStorage.getItem("filter_data"); // Get recommended data from localStorage

  // Load recommended data from localStorage
  useEffect(() => {
    if (filterData) {
      try {
        const parsedData = JSON.parse(filterData);
        setRecommendedData(parsedData); // Set parsed recommended data
      } catch (e) {
        console.error("Error parsing content_based_filter:", e);
      }
    }
  }, [filterData]);

  // Fetch all dishes from the backend
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dish");
        const data = await response.json();
        setDishes(data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
        setError("Failed to load dishes. Please try again later.");
      }
    };

    fetchDishes();
  }, []);

  // Handle card click for both recommended and general dishes
  const handleCardClick = async (dishId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/dish", {
        dishId,
      });
      if (response.data) {
        navigate("/plate", { state: { dish_data: response.data } });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      setError("An error occurred while processing the request.");
    }
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">Dish List</h1>

      {/* Horizontal grid for recommended dishes */}
      <div className="row mb-5">
        <h2>Recommended Dishes</h2>
        {recommendedData && recommendedData.length > 0 ? (
          recommendedData.map((dish) => (
            <div key={dish.dish_id} className="col-md-6 col-lg-4 mb-3">
              <Card
                title={dish.name}
                imageUrl={dish.imageUrl || "https://via.placeholder.com/300x200"}
                imageAlt={dish.name}
                content={`Category: ${dish.food_category}, Allergens: ${dish.allergens || "None"}`}
                dish_id={dish.dish_id}
                onCardClick={handleCardClick} // Ensure this is passed to Card component
              />
            </div>
          ))
        ) : (
          <p>No recommendations available</p>
        )}
      </div>

      {/* Vertical grid for all dishes */}
      <div className="row g-4">
        <h2>All Dishes</h2>
        {dishes && dishes.length > 0 ? (
          dishes.map((dish) => (
            <div key={dish.dish_id} className="col-lg-4 col-md-6">
              <Card
                title={dish.name}
                imageUrl={dish.imageUrl || "https://via.placeholder.com/300x200"}
                imageAlt={dish.name}
                content={`Category: ${dish.food_category}, Allergens: ${dish.allergens || "None"}`}
                dish_id={dish.dish_id}
                onCardClick={handleCardClick} // Ensure this is passed to Card component
              />
            </div>
          ))
        ) : (
          <p>No dishes available</p>
        )}
      </div>

      {/* Error display */}
      {error && <p className="text-danger mt-4">{error}</p>}
    </div>
  );
};

export default HomePage;
