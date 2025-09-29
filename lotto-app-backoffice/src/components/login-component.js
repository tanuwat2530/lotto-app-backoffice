import React, { useState } from 'react';
import '../styles/login-page-style.css'; // Import the CSS file

// Component now accepts a prop: onLoginSuccess
const LoginPage = ({ onLoginSuccess }) => {
 const adminUser = process.env.NEXT_PUBLIC_ADMIN_USER; 
 const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS; 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // --- Authentication Logic ---
    console.log('Attempting to log in with:', { username, password });

    // 💡 Replace this sample logic with your Express API call later!
    if (username === adminUser && password === adminPass) {
      // 🚀 SUCCESS: Call the function passed from the parent Next.js page
      sessionStorage.setItem("admin_user", username);
       sessionStorage.setItem("admin_pass", password);
      if (onLoginSuccess) {
        
        onLoginSuccess();
        
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          
          {/* ... (Username and Password Input fields remain the same) ... */}
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <div className="input-container">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-container">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          {/* -------------------------------------------------------- */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <button
              type="submit"
              className="submit-button"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;