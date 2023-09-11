import React, { createContext, useState, useContext } from 'react';

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbarData, setSnackbarData] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarData({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbarData({ ...snackbarData, open: false });
  };

  return (
    <SnackbarContext.Provider value={{ snackbarData, showSnackbar, closeSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};
