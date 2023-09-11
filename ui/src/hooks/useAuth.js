import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from 'next/router';
import { AuthContext } from '../context/Auth/AuthContext';
import * as RestAccess from '../utils/RestAccess';
import Router from 'next/router';

const useAuth = (redirect = null) => {
    const router = useRouter();
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const authCheck = async () => {
            setLoading(true);
            const response = await RestAccess.get('/user'); 
            setLoading(false);  
            // console.log(response.status);
            if(response.status === 200) {
                const { data: user} = response;
                setAuthUser(user);
            } else {
                setAuthUser(null);
                if(redirect) {
                    Router.push(redirect);
                }
            }
        };
        authCheck();
        
    }, [redirect, setAuthUser]);

    return { authUser, loading };
}

export default useAuth;

