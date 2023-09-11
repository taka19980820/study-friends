import { RegisterInputProvider } from '../context/RegisterInputContext'
import { AuthProvider } from '../context/Auth/AuthContext'
import { SnackbarProvider, useSnackbar } from '../context/SnackbarContext';
import CustomSnackbar from '../components/SnackBar';
import Layout from '../components/Layout/'
import '@/styles/globals.css'

const App = ({ Component, pageProps }) => {
  return (
    <RegisterInputProvider>
      <SnackbarProvider>
        <AuthProvider>
          <AppComponent Component={Component} pageProps={pageProps} />
        </AuthProvider>
      </SnackbarProvider>
    </RegisterInputProvider> 
  )
}

const AppComponent = ({ Component, pageProps }) => {
  const { snackbarData, closeSnackbar } = useSnackbar();
  return (
    <>
      <Component {...pageProps} />
      <CustomSnackbar
        open={snackbarData.open}
        handleClose={closeSnackbar}
        severity={snackbarData.severity}
        message={snackbarData.message}
    />
    </>
  );
}

export default App;
