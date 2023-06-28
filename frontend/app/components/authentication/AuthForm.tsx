'use client'
import React, { useState } from "react";
import { API_SERVER } from "@/app/utils/config";
import axios from 'axios';

import './style.css'

const Authentication = () => {
  let [authMode, setAuthMode] = useState("signin");

  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [email, setEmail] = useState('')

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };

  // Login Action
  const handleSubmit_Login = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post(API_SERVER, {
        username_or_email: usernameOrEmail,
        password: loginPassword
      })
        .then(async (data) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err)
        })
    }
    catch (err) {
      console.log(err);
    }
  }

  // Register Action
  const handleSubmit_Register = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await axios.post(API_SERVER, {
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: registerPassword
      })
        .then(async (data) => {
          console.log(data);
        })
        .catch(err => {
          console.log(err)
        })
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
                type="email"
                className="form-control mt-1"
                placeholder="Enter username or email address"
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
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
          <h3 className="Auth-form-title">Sign In</h3>
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
              className="form-control mt-1"
              placeholder="e.g David"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Last Name</label>
            <input
              className="form-control mt-1"
              placeholder="e.g Jin"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
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