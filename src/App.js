import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

import { store } from './entities/store/store';

import AdminPage from './pages/Admin/Main/AdminPage';
import IngredientsAdminPage from './pages/Admin/Ingredients/IngredientsAdminPage';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import DiscountPage from './pages/Discount/DiscountPage';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import LoyaltySystemPage from './pages/LoyaltySystemPage/LoyaltySystemPage';
import Menu from './widgets/Menu/Menu';

import './index.css';

export default function App() {
  return (
    <div style={{ backgroundColor: '#FDEFD5', minHeight: '100vh' }}>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Menu withHeader />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/admin/ingredients"
              element={<IngredientsAdminPage />}
            />
            <Route path="/admin/loyalty" element={<LoyaltySystemPage />} />
            <Route path="/discount" element={<DiscountPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}
