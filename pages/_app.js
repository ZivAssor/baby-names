import Sidebar from '@/components/Sidebar'
import '@/styles/globals.css'
import { ThemeProvider } from "@material-tailwind/react";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
    <Sidebar>
  <Component {...pageProps} />
  </Sidebar>
  </ThemeProvider>
  )
}
