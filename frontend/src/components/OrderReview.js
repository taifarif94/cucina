import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

// Star Rating Component with improved fill effect
const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const { left, width } = container.getBoundingClientRect();
    const x = e.clientX - left;
    
    // Calculate a half-star rating (0 to 5 in increments of 0.5)
    const halfStarValue = Math.round((x / width) * 10) / 2;
    const newHover = Math.max(0, Math.min(5, halfStarValue));
    setHoverRating(newHover);
  };

  const handleStarClick = () => {
    setRating(hoverRating);
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  // Function to calculate the fill percentage for each star
  const getStarFillPercentage = (starPosition) => {
    const currentRating = hoverRating || rating;
    if (currentRating >= starPosition) return 100;
    if (currentRating < starPosition - 1) return 0;
    return (currentRating % 1) * 100;
  };

  return (
    <div 
      className="relative h-8 w-40 cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleStarClick}
    >
      <div className="absolute flex">
        {[1, 2, 3, 4, 5].map((starPosition) => (
          <div key={starPosition} className="relative">
            {/* Background star (gray) */}
            <Star 
              size={32} 
              className="text-gray-200"
            />
            
            {/* Filled star with clip-path */}
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{
                clipPath: `inset(0 ${100 - getStarFillPercentage(starPosition)}% 0 0)`
              }}
            >
              <Star 
                size={32} 
                className={hoverRating > 0 ? "text-yellow-300" : "text-yellow-500"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cart = location.state?.cart || [];

  const handleRatingChange = (itemId, rating) => {
    setReviews(prev => ({
      ...prev,
      [itemId]: rating
    }));
  };

  const handleSubmitReviews = async () => {
    setIsSubmitting(true);
    
    // Check if all items have been rated
    const allItemsRated = cart.every(item => reviews[item.id] !== undefined);
    
    if (!allItemsRated) {
      alert('Please rate all items before submitting');
      setIsSubmitting(false);
      return;
    }

    try {
      // Here you would typically send the reviews to your backend
      console.log('Submitting reviews:', reviews);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to confirmation page or home
      navigate('/review-confirmation', { 
        state: { 
          reviews,
          totalItems: cart.length 
        }
      });
    } catch (error) {
      console.error('Error submitting reviews:', error);
      alert('Failed to submit reviews. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Rate Your Order</h1>
      
      <div className="space-y-8">
        {cart.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {item.type === 'dish' ? item.dish.name : 'Custom Plate'}
                </h2>
                {item.type === 'dish' && (
                  <>
                    {item.addOns?.length > 0 && (
                      <p className="text-gray-600 text-sm mt-1">
                        Add-ons: {item.addOns.map(addon => addon.name).join(', ')}
                      </p>
                    )}
                    {item.beverage && (
                      <p className="text-gray-600 text-sm">
                        Beverage: {item.beverage.name}
                      </p>
                    )}
                  </>
                )}
                {item.type === 'custom' && (
                  <div className="text-gray-600 text-sm mt-1">
                    {item.layers.map((layer, idx) => (
                      <p key={idx}>
                        Layer {idx + 1}: {layer.components.map(comp => comp.item).join(', ')}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold">
                ${Number(item.price).toFixed(2)}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Your Rating:
              </span>
              <StarRating 
                rating={reviews[item.id] || 0}
                setRating={(rating) => handleRatingChange(item.id, rating)}
              />
              <span className="text-sm text-gray-500">
                {reviews[item.id] ? reviews[item.id].toFixed(1) : '0.0'} / 5.0
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmitReviews}
          disabled={isSubmitting}
          className={`
            px-8 py-3 rounded-lg text-white font-semibold
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Reviews'}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;