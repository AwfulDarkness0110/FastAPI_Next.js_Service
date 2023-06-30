'use client'
import { createNotification } from "@/app/components/Alert";
import { Authentication, Verification } from "@/app/components/authentication";
import AuthContext from "@/app/context/AuthContext";
import { API_URL, NEXT_URL } from "@/lib/config";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const Page = () => {
    const { user, verify } = useContext(AuthContext);
    const router = useRouter();

    const { query } = router;

    useEffect(() => {
        if (query?.token) {
            verify(query.token)
        }
    }, [query?.token])


    useEffect(() => {
        if (!user) {
            router.push('/auth');
        }
        else if (!user.status) {
        }
        else {
            router.push('/welcome')
        }
    }, []);

    return (
        !user?.status ?
            <Verification />
            : router.push('/welcome')
    )
}

export default Page;