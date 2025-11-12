import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Verify = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email || "";

    const [otp, setOtp] = useState("");
    console.log(email, "<<");
    const handleVerify = async (e) => {
        e.preventDefault();
        
        const res = await fetch("http://localhost:8000/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });

        const data = await res.json();

        if (data.success) {
            alert("OTP verified successfully!");
            navigate("/reset-password", { state: { email } });
        } else {
            alert("Invalid OTP!");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white shadow rounded-xl">
            <h2 className="text-2xl font-semibold mb-4">Verify Email</h2>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                    required
                />
                <button className="w-full bg-green-500 text-white p-2 rounded">
                    Verify
                </button>
            </form>
        </div>
    );
};

export default Verify;