import React, { useState } from 'react';

const Signup = () => {
  const [form, setForm] = useState({
    role: 'student',
    student_id: '',
    name: '',
    email: '',
    password: '',
    contact: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage('Signup failed');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Signup</h2>
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
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Student ID */}
        <div className="mb-3">
          <label htmlFor="student_id" className="form-label">ID</label>
          <input
            type="text"
            className="form-control"
            id="student_id"
            name="student_id"
            placeholder="Enter your ID"
            value={form.student_id}
            onChange={handleChange}
            required
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Contact */}
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">Contact</label>
          <input
            type="text"
            className="form-control"
            id="contact"
            name="contact"
            placeholder="Phone number"
            value={form.contact}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-success w-100">Signup</button>
      </form>

      {/* Message display */}
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default Signup;
