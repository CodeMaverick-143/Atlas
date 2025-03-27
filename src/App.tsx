import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import WorldMap from './components/WorldMap';
import CountryDetails from './components/CountryDetails';
import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<WorldMap />} />
                <Route path="/country/:countryCode" element={<CountryDetails />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;