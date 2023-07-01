'use client'
import { Authentication, Verification } from "@/app/components/authentication";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const Page = () => {
    const { user, verify } = useContext(AuthContext);
    const router = useRouter()

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
        <Verification />
    )
}

export default Page;