import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Login = () => {
  const [form, setForm] = useState({
    role: 'student', //default role
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const RegistrationMessage = location.state?.message;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMessage(data.message);
      console.log('dataa', data);
      console.log('dataa token', data.token);
      // Check if login was successful by checking if user is set
      // Optionally, you can check user from context here if needed

      if (data.token) {
        const success = await login(data.token);
        if (success) {
          navigate('/', { state: { message: 'Login successful' } });
        } else {
          setMessage('Unable to fetch user details.');
        }
      }
    } catch (err) {
      setMessage('Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='container mt-5' style={{ maxWidth: '500px' }}>
      <h2 className='text-center mb-4'>Login</h2>
      {RegistrationMessage && <div className='alert alert-success mt-3'>{RegistrationMessage}</div>}
      {message && <div className='alert alert-danger mt-3'>{message}</div>}

      <form onSubmit={handleSubmit}>
        {/* Role selection */}
        <div className='mb-3'>
          <label htmlFor='role' className='form-label'>
            Select Role
          </label>
          <select className='form-select' id='role' name='role' value={form.role} onChange={handleChange}>
            <option value='student'>Student</option>
            <option value='teacher'>Teacher</option>
            <option value='admin'>Admin</option>
          </select>
        </div>

        {/* Email input */}
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            Email address
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            placeholder='Enter email'
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password input */}
        <div className='mb-3'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            placeholder='Password'
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type='submit' className='btn btn-primary w-100' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className='mt-3 text-center'>
        <span>Don't have an account? </span>
        <Link to='/signup'>Sign up</Link>
      </div>
    </div>
  );
};

export default Login;
