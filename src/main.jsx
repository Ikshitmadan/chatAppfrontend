import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserContext, UserContextProvider } from './userContext.jsx'
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root')).render(
<ChakraProvider>
    <UserContextProvider>
    <App />
    </UserContextProvider>
    </ChakraProvider>
)
