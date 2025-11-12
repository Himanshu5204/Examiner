import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.success) {
            alert("OTP sent to your email!");
            navigate("/verify", { state: { email } }); // pass email to verify page
        } else {
            alert("Failed to send OTP");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />
                <button className="w-full bg-blue-500 text-white p-2 rounded">
                    Send OTP
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;