import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SurveyQuestions = () => {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({
        ageGroup: '',
        meatConsumed: [],
        dietaryRestrictions: [],
        foodAllergies: [],
        sweetTooth: '',
        spiceLevel: '',
        favoriteDrink: '',
        healthIndulgence: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Survey answers:', answers);
        navigate('/'); // Navigate to the main app after submission
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <h1 className="text-3xl font-semibold mb-6 text-center">Survey Questions</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Age Group */}
                    <div>
                        <label className="block text-lg mb-2">How old are you?</label>
                        <select
                            className="w-full p-2 border rounded bg-gray-100"
                            value={answers.ageGroup}
                            onChange={(e) => setAnswers({ ...answers, ageGroup: e.target.value })}
                            required
                        >
                            <option value="">Select your age group</option>
                            <option value="under18">Under 18</option>
                            <option value="18-25">18 - 25</option>
                            <option value="26-35">26 - 35</option>
                            <option value="36-50">36 - 50</option>
                            <option value="over50">Over 50</option>
                        </select>
                    </div>

                    {/* Meat Consumed */}
                    <div>
                        <label className="block text-lg mb-2">Which meat do you consume?</label>
                        <div className="space-y-2">
                            {['Beef', 'Fish', 'Chicken', 'Pork', 'Lamb', 'None'].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers.meatConsumed.includes(option)}
                                        onChange={(e) => {
                                            const updatedSelection = e.target.checked
                                                ? [...answers.meatConsumed, option]
                                                : answers.meatConsumed.filter(item => item !== option);
                                            setAnswers({ ...answers, meatConsumed: updatedSelection });
                                        }}
                                        className="form-checkbox"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div>
                        <label className="block text-lg mb-2">Do you follow any dietary restrictions?</label>
                        <div className="space-y-2">
                            {['Vegan', 'Vegetarian', 'Gluten free', 'None'].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers.dietaryRestrictions.includes(option)}
                                        onChange={(e) => {
                                            const updatedSelection = e.target.checked
                                                ? [...answers.dietaryRestrictions, option]
                                                : answers.dietaryRestrictions.filter(item => item !== option);
                                            setAnswers({ ...answers, dietaryRestrictions: updatedSelection });
                                        }}
                                        className="form-checkbox"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Food Allergies */}
                    <div>
                        <label className="block text-lg mb-2">Do you have any food allergies?</label>
                        <div className="space-y-2">
                            {['Peanut', 'Dairy', 'Shellfish', 'Treenuts', 'None'].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers.foodAllergies.includes(option)}
                                        onChange={(e) => {
                                            const updatedSelection = e.target.checked
                                                ? [...answers.foodAllergies, option]
                                                : answers.foodAllergies.filter(item => item !== option);
                                            setAnswers({ ...answers, foodAllergies: updatedSelection });
                                        }}
                                        className="form-checkbox"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sweet Tooth */}
                    <div>
                        <label className="block text-lg mb-2">Do you have a sweet tooth?</label>
                        <div className="flex gap-4">
                            {['Yes', 'No'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`px-6 py-2 rounded ${
                                        answers.sweetTooth === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                    onClick={() => setAnswers({ ...answers, sweetTooth: option })}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Spice Level */}
                    <div>
                        <label className="block text-lg mb-2">How spicy do you like your food?</label>
                        <div className="flex justify-between gap-2">
                            {['Low', 'Medium', 'High'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    className={`flex-1 py-2 rounded ${
                                        answers.spiceLevel === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                    onClick={() => setAnswers({ ...answers, spiceLevel: option })}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Drink */}
                    <div>
                        <label className="block text-lg mb-2">Which of the following drinks do you consume the most?</label>
                        <select
                            className="w-full p-2 border rounded bg-gray-100"
                            value={answers.favoriteDrink}
                            onChange={(e) => setAnswers({ ...answers, favoriteDrink: e.target.value })}
                            required
                        >
                            <option value="">Select a drink</option>
                            <option value="Water">Water</option>
                            <option value="Alcohol">Alcohol</option>
                            <option value="Juice/milkshakes">Juice/milkshakes</option>
                            <option value="Soft drinks">Soft drinks</option>
                        </select>
                    </div>

                    {/* Health vs. Indulgence */}
                    <div>
                        <label className="block text-lg mb-2">
                            Do you prefer healthier food options, or do you want to indulge?
                        </label>
                        <select
                            className="w-full p-2 border rounded bg-gray-100"
                            value={answers.healthIndulgence}
                            onChange={(e) => setAnswers({ ...answers, healthIndulgence: e.target.value })}
                            required
                        >
                            <option value="">Choose an option</option>
                            <option value="Healthier options">Healthier options</option>
                            <option value="Indulgent meals">Indulgent meals</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Submit Survey
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SurveyQuestions;
