import React, { useState } from 'react';

const Login = () => {
  const [form, setForm] = useState({
    role: 'student',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        {/* Role selection */}
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Select Role</label>
          <select
            className="form-select"
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value='student'>Student</option>
            <option value='teacher'>Teacher</option>
            <option value='admin'>Admin</option>
          </select>
        </div>

        {/* Email input */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password input */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>

      {/* Message */}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Login;
