import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import MobilePhones from './pages/MobilePhones';
import Tablets from './pages/Tablets';
import Smartwatches from './pages/Smartwatches';
import MobileSpecs from './pages/MobileSpecs';
import AllBrands from './pages/AllBrands';
import News from './pages/News';
import Reviews from './pages/Reviews';
import ComingSoon from './pages/ComingSoon';
import WhatsNew from './pages/WhatsNew';
import About from './pages/About';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import SingleNewsDetail from './pages/SingleNewsDetail';
import SingleReviewDetail from './pages/SingleReviewDetail';
import Videos from './pages/Videos';
import Dictionary from './pages/Dictionary';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BrandPage from './pages/BrandPage';
import Comparison from './pages/Comparison';
import SearchPage from './pages/SearchPage';
import AdvancedSearch from './pages/AdvancedSearch';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import privateRoutes from './routes/PrivateRoutes';

function App() {
  return (
    <AuthProvider>
    <DataProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/phones" element={<MobilePhones />} />
            <Route path="/tablets" element={<Tablets />} />
            <Route path="/smartwatches" element={<Smartwatches />} />
            <Route path="/all-brands" element={<AllBrands />} />
            <Route path="/news" element={<News />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/coming-soon" element={<ComingSoon />} />
            <Route path="/whats-new" element={<WhatsNew />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/news/:newsSlug" element={<SingleNewsDetail />} />
            <Route path="/review/:reviewSlug" element={<SingleReviewDetail />} />
            <Route path="/brand/:brandSlug" element={<BrandPage />} />
            {privateRoutes}
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/advanced-search" element={<AdvancedSearch />} />
            <Route path="/product/:productId/:productSlug?" element={<MobileSpecs />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DataProvider>
    </AuthProvider>
  );
}

export default App;
