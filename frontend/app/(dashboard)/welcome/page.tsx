'use client'
import React, { Fragment, useContext, useEffect } from 'react'
import { Welcome } from '@/app/components/authentication'
import AuthContext from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation';

const welcome = () => {
    const { user } = useContext(AuthContext);

    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/auth');
        }
        else if (!user.status) {
            router.push('/verify')
        }
    }, []);

    return (
        <div>
            <Welcome />
        </div>
    )
}

export default welcome