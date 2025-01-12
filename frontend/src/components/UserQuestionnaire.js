import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SurveyQuestions = () => {
    const navigate = useNavigate();
    const user_id = localStorage.getItem('user_id');
    const [answers, setAnswers] = useState({
        ageGroup: '',
        preferred_meat: [],
        vegetarian_meat: [],
        allergies: [],
        sweet_tooth: '',
        spice_level: '',
        // favoriteDrink: '',
        healthy_or_calorie_heavy: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(user_id);
            const response = await axios.post(
                'http://localhost:5000/api/survey/post_answers',
                { answers, user_id},
            );
            console.log('content_bassdcsdcsdcsdcsdcsdcsdcsdcsdcsdcsdcsdcsdced_filter',response.data);
            localStorage.setItem('filter_data', response.data.content_based_filter);
            navigate('/home'); // Redirect to questionnaire
            console.log('Survey answers submitted:', response);
        } catch (error) {
            console.error('Error submitting survey:', error);
        }
    };
            
    
    
    
    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                <h1 className="text-3xl font-semibold mb-6 text-center">Survey Questions</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Age Group */}
                    {/* <div>
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
                    </div> */}

                    {/* Meat Consumed */}
                    <div>
                        <label className="block text-lg mb-2">Which meat do you consume?</label>
                        <div className="col-md-4">
                            {['Beef', 'Goose ', 'Chicken', 'Pork', 'Veal', 'Fish', 'Salmon', 'Tuna', 'None'].map((option) => (
                                <label key={option} className="row-md-3">
                                    <input
                                        type="checkbox"
                                        checked={answers.preferred_meat.includes(option)}
                                        onChange={(e) => {
                                            const updatedSelection = e.target.checked
                                                ? [...answers.preferred_meat, option]
                                                : answers.preferred_meat.filter(item => item !== option);
                                            setAnswers({ ...answers, preferred_meat: updatedSelection });
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
                            {['Meat', 'Vegetarian'].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers.vegetarian_meat.includes(option)}
                                        onChange={(e) => {
                                            const updatedSelection = e.target.checked
                                                ? [...answers.vegetarian_meat, option]
                                                : answers.vegetarian_meat.filter(item => item !== option);
                                            setAnswers({ ...answers, vegetarian_meat: updatedSelection });
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
                            {['Seafood', 'Gluten', 'Dairy', 'None'].map((option) => (
                                <label key={option} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={answers.allergies.includes(option)}
                                        onChange={(e) => {
                                            const updatedSelection = e.target.checked
                                                ? [...answers.allergies, option]
                                                : answers.allergies.filter(item => item !== option);
                                            setAnswers({ ...answers, allergies: updatedSelection });
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
                                        answers.sweet_tooth === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                    onClick={() => setAnswers({ ...answers, sweet_tooth: option })}
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
                                        answers.spice_level === option ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                    }`}
                                    onClick={() => setAnswers({ ...answers, spice_level: option })}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Drink */}
                    {/* <div>
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
                    </div> */}

                    {/* Health vs. Indulgence */}
                    <div>
                        <label className="block text-lg mb-2">
                            Do you prefer healthier food options, or do you want to indulge?
                        </label>
                        <select
                            className="w-full p-2 border rounded bg-gray-100"
                            value={answers.healthy_or_calorie_heavy}
                            onChange={(e) => setAnswers({ ...answers, healthy_or_calorie_heavy: e.target.value })}
                            required
                        >
                            <option value="">Choose an option</option>
                            <option value="healthy">Healthy Food</option>
                            <option value="heavy">Indulgent meals(Calorie Heavy)</option>
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
