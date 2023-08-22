import { createContext, useContext, useState } from 'react';

const RegisterInputContext = createContext();

export const useRegisterInput = () => {
    return useContext(RegisterInputContext);
}

export const RegisterInputProvider = ({ children }) => {
    const [registerInput, setRegisterInput] = useState({
        name: '',
        email: '',
        password: '',
    });

    return (
        <RegisterInputContext.Provider value={{ registerInput, setRegisterInput }}>
            {children}
        </RegisterInputContext.Provider>
    )
}

