import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log('2');

        if (username === 'admin' && password === 'password') {
            alert('Login successful!');
            onLoginSuccess();
            navigate('/');
        } else {
            try {
                const response = await axios.post('http://localhost:5000/api/login', {
                    username,
                    password
                });
                console.log('Response:', response.data);
                alert('Login details saved successfully!');
            } catch (error) {
                console.error('Error saving login details:', error);
                alert('Failed to save login details!');
            }
        }
    };
    
    const handleGoogleLoginSuccess = async (response) => {
        console.log('Google login response:', response);
        try {
            const backendResponse = await axios.post('http://localhost:5000/api/google-login', {
                token: response.credential,
            });
            console.log('Backend response:', backendResponse.data);
            alert('Google login successful!');
            onLoginSuccess();
            navigate('/');
        } catch (error) {
            console.error('Error posting Google login details:', error);
            alert('Failed to log in with Google!');
        }
    };

    return (
        <div className="login-page" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Login</h2>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleLogin}>Login</button>
            <div style={{ marginTop: '20px' }}>
                <GoogleOAuthProvider clientId="326160157051-sulsasmu3q4p8ro3elbaas9b0ci9mokr.apps.googleusercontent.com">
                    <GoogleLogin 
                        onSuccess={handleGoogleLoginSuccess} 
                        onError={() => alert('Google login failed!')} 
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
};

export default Login;
