import React from 'react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import { AuthContextProvider } from './context/AuthContext';
import Menu from './pages/Menu';
import Protected from './components/Protected';
import Orders from './components/Orders';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Payment from './pages/Payment';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          {/* <Route path="/menu" element={<Auth />} /> */}
          {/* <Route path="/menu/:id" element={<Auth />} /> -> useParam() Hook to get the param */}
          <Route
            path="/menu"
            element={
              <Protected>
                <Menu />
              </Protected>
            }
          />
          <Route
            path="/orders"
            element={
              <Protected>
                <Orders />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected>
                <Admin />
              </Protected>
            }
          />
          <Route
            path="/payment"
            element={
              <Protected>
                <Payment />
              </Protected>
            }
          />
          <Route
            path="/order-confirmation" // Corrected route path
            element={
              <Protected>
                <OrderConfirmation />
              </Protected>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;