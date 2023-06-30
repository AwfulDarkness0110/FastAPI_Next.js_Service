import { useState, useEffect, createContext } from "react";
import { useRouter } from "next/navigation";
import { UserType } from "@/interfaces";
import axios from "axios";
import { NEXT_URL } from "@/lib/config";
import { createNotification } from "../components/Alert";
// import {NEXT_URL} from '../config/index';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | UserType>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // useEffect(() => checkedUserLoggedIn(), [])

  const router = useRouter();

  // Register user
  const register = async ({
    username,
    first_name,
    last_name,
    email,
    password,
  }: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    console.log(username, first_name, last_name, email, password);

    // api router
    await axios.post(`${NEXT_URL}/api/register`, {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password
    })
      .then(async (res) => {
        createNotification('success', res.data.message || '😅 You registered successfully!')
        setUser(res.data.user);
        router.push('/welcome');
      })
      .catch(err => {
        createNotification('😐 Failed Registration...', err.response.statusText + JSON.stringify(err.response.data))
        console.log(err)
      })
  };

  // Login user
  const login = async ({
    email_or_username,
    password
  }: {
    email_or_username: string;
    password: string;
  }) => {
    console.log(email_or_username, password)
    try {
      await axios
        .post(`${NEXT_URL}/api/login`, {
          email_or_username: email_or_username,
          password: password,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*',
          }
        })
        .then(res => {
          // console.log('axios res: ', res)
          // console.log('context axios login res', res.data);

          console.log(res.data.data.user)

          createNotification('success', "👋 You Logged In Successfully!")
          setUser(res.data.data.user);
          router.push('/welcome');
        })
        .catch(err => {
          console.log('axios err: ', err)
          createNotification('😐 Failed Log in...', "\n" + err.response.statusText + JSON.stringify(err.response.data))
          setError(err.message);
          setError(null);
        });
      setIsLoading(true);
      console.log(email_or_username, password);
    }
    catch (err: any) {
      console.log(err.message)
    }
  };

  // Logout user
  const logout = async () => {
    console.log("User Logged out");
    await axios.post(`${NEXT_URL}/api/logout`)
      .then(res => {
        createNotification('success', "😴 Log out....")
        setUser(null)
      })
      .catch(err => {
        createNotification('😐 Failed Log out...', err.response.statusText + JSON.stringify(err.response.data))
        // console.log(err.message);
      })
  };

  // Check if user is logged in
  const checkedUserLoggedIn = async () => {
    const res = await axios.get(`${NEXT_URL}/api/user`)
      .then(async (res) => {
        setUser(res.data.user)
      })
      .catch(err => {
        setUser(null)
      })
  };

  // Verify User
  const verify = async (token: string) => {
    axios
      .post(`${NEXT_URL}/verify`, {
        "verify_token": token
      })
      .then(res => {
        createNotification('success', "👋 You Verified Successfully!")
        setUser(res.data.data.user);
        router.push('/welcome');
      })
      .catch(err => {
        createNotification('😐 Failed Verify...', err.response.statusText + JSON.stringify(err.response.data))
      })
  }

  return (
    <AuthContext.Provider
      value={{ register, login, logout, isLoading, user, error, verify }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;