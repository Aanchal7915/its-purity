import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import FeaturedProducts from './pages/admin/FeaturedProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReels from './pages/admin/AdminReels';
import AdminCategoryPage from './pages/admin/AdminCategoryPage';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';

import UserDashboard from './pages/UserDashboard';

import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CustomizedSolutionPage from './pages/CustomizedSolutionPage';
import LearnArticlePage from './pages/LearnArticlePage';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import ShippingAndRefund from './pages/legal/ShippingAndRefund';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Sitemap from './pages/legal/Sitemap';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <>
      <ScrollToTop />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="customized-solution" element={<CustomizedSolutionPage />} />
        <Route path="learn/:slug" element={<LearnArticlePage />} />
        <Route path="terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="shipping-and-refund" element={<ShippingAndRefund />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="sitemap" element={<Sitemap />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/featured" element={<FeaturedProducts />} />
        <Route path="products/create" element={<AdminProductEdit />} />
        <Route path="products/:id/edit" element={<AdminProductEdit />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reels" element={<AdminReels />} />
        <Route path="categories" element={<AdminCategoryPage />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;
