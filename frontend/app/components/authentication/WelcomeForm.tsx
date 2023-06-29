'use client'
import React, { useContext } from "react";
import './style.css'
import AuthContext from "@/app/context/AuthContext";

const Welcome = () => {
    const { logout, user } = useContext(AuthContext);

    return (
        <div className="Auth-form-container">
            <form className="Auth-form">
                <div className="Auth-form-content">
                    <h3 className="Auth-form-title">
                        <p>👋</p>
                        You Verified Success
                    </h3>
                    <div style={{ display: 'flex', height: "100%" }}>
                        <div>
                            <img src="welcome.png" />
                        </div>
                        <div className="text-center">
                            Now, you are verified user. You can use this system.
                            <button type="button" className="mt-5 btn btn-primary">Log out</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Welcome