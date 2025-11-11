import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    console.log(email, "<<");
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const res = await fetch("http://localhost:8000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role, password }),
        });

        const data = await res.json();

        if (data.success) {
            alert("Password reset successfully!");
            navigate("/login");
        } else {
            console.log(data.message);
            alert(data.message || "Failed to reset password");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;