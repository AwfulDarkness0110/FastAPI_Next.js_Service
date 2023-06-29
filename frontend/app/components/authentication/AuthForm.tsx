'use client'
import React, { useContext, useState } from "react";
import { API_URL, NEXT_URL } from "@/lib/config";
import axios from 'axios';

import './style.css';
import { createNotification } from "../Alert";
import AuthContext from "@/app/context/AuthContext";
import Link from "next/link";
import Image from 'next/image';

const Authentication = () => {
  let [authMode, setAuthMode] = useState("signin");

  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [email, setEmail] = useState('')

  const { login, register, error, user, isLoading } = useContext(AuthContext);

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  // Login Action
  const handleSubmit_Login = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      console.log(emailOrUsername, loginPassword);
      await login(
        {
          'email_or_username': emailOrUsername,
          'password': loginPassword
        }
      );
    }
    catch (err) {
      console.log(err);
    }
  }

  // Register Action
  const handleSubmit_Register = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await register(
        {
          'username': username,
          'first_name': firstName,
          'last_name': lastName,
          'email': email,
          'password': registerPassword
        }
      )
    }
    catch (err) {
      console.log(err);
    }
  }

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit_Login}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Username or Email address</label>
              <input
                name='email_or_username'
                className="form-control mt-1"
                placeholder="Enter username or email address"
                onChange={(e) => setEmailOrUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                name='loginPassword'
                type="password"
                className="form-control mt-1"
                placeholder="Enter password"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
            <div className="d-grid gap-2 mt-10 bg-yellow-100 py-3 justify-center" style={{ borderRadius: "10px" }}>
              <span><Image src="./google.svg" alt="google" width={30} height={30} /></span>
              <span>Google</span>
            </div>
            <p className="text-center mt-2">
              Forgot <a href="#">password?</a>
            </p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit_Register}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              className="form-control mt-1"
              placeholder="e.g darkness"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>First name</label>
            <input
              name='firstName'
              className="form-control mt-1"
              placeholder="e.g David"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              name='lastName'
              className="form-control mt-1"
              placeholder="e.g Jin"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              name='email'
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              name='registerPassword'
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Authentication