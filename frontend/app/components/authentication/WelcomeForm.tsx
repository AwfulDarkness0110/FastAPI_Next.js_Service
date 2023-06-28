'use client'
import React from "react";
import './style.css'

const Welcome = () => {
    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">
                        <p>👋</p>
                        You Verified Success
                    </h3>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <img src="welcome.png" />
                        </div>
                        <div className="text-center">
                            Now, you are verified user. You can use this system.
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Welcome