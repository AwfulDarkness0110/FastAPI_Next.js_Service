'use client'
import React, { useContext, useEffect } from "react";
import './style.css'
import AuthContext from "@/app/context/AuthContext";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/navigation";

const Welcome = () => {
    const { user } = useContext(AuthContext);

    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth')
        }
    }, [user]);

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
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Welcome