import * as React from 'react';
import { useState } from 'react';
import LoadingPage from '../../Loading';
import useAuth from '../../../hooks/useAuth';
import { useRouter } from 'next/router';

export default function LoggedInLayout({ children }) {
    const { authUser, loading } = useAuth('/login');

    if(loading) {
        return <LoadingPage />
    }
  
    if(!authUser) {
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}
