import * as React from 'react';
import { Suspense, useState, useEffect, useLayoutEffect } from 'react';
import LoadingPage from '../Loading';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const { user, loading } = useAuth('/login');
    const router = useRouter();

    if(loading) {
        return <LoadingPage />
    }

    if(!user) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}


