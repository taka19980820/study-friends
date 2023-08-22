import { RegisterInputProvider } from '../context/RegisterInputContext'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <RegisterInputProvider>
      <Component {...pageProps} />
    </RegisterInputProvider> 
  )
}
