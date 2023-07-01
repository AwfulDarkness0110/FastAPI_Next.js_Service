'use client'
import React, { useContext } from "react";
import './style.css'
import LogoutButton from "./LogoutButton";
import AuthContext from "@/app/context/AuthContext";
import axios from "axios";
import { createNotification } from "../Alert";

const Verification = () => {
    const { user } = useContext(AuthContext);

    const resend_verify_request = () => {
        axios.get(`${process.env.NEXT_APP_SERVER_ENDPOINT}/verify?resend_verify=true&username=${user.username}`)
            .then(res => {
                console.log("resend verification reply: ", res);

                createNotification('success', res.data.message);
            })
            .catch(err => {
                console.log("resend verification reply_error: ", err);
                createNotification('failed', err.message);
            })

    }

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
                        If you didn't receive, 👉 <a href='#' onClick={resend_verify_request}>Resend Email</a>
                    </p>
                    <LogoutButton />
                </div>
            </form>
        </div>
    );
}

export default Verification