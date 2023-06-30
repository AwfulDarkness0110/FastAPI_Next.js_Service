'use client'
import React from "react";
import './style.css'
import LogoutButton from "./LogoutButton";

const Verification = () => {
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">
                        <p>😉</p>
                        Verify Your Account
                    </h3>
                    <div className="text-center">
                        We just send verification url to your email. Please LOOK AT your email and verify your account.
                    </div>
                    <p className="text-center mt-5">
                        If you didn't receive, 👉 <a href="#">Resend</a> Url
                    </p>
                    <LogoutButton />
                </div>
            </form>
        </div>
    );
}

export default Verification