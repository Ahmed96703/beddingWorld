import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { StorefrontLayout } from "@/components/layout/storefront-layout";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { RouteFallback } from "@/components/route-fallback";
import { RequireAdmin } from "@/routes/admin/require-admin";
import { AdminLayout } from "@/routes/admin/admin-layout";

// Route-level code splitting — each page is its own chunk.
const HomePage = lazy(() => import("@/routes/home"));
const CategoryPage = lazy(() => import("@/routes/category"));
const SubCategoryPage = lazy(() => import("@/routes/subcategory"));
const ProductPage = lazy(() => import("@/routes/product"));
const SearchPage = lazy(() => import("@/routes/search"));
const CartPage = lazy(() => import("@/routes/cart"));
const CheckoutPage = lazy(() => import("@/routes/checkout"));
const OrderSuccessPage = lazy(() => import("@/routes/order-success"));
const AboutPage = lazy(() => import("@/routes/about"));
const PrivacyPolicyPage = lazy(() => import("@/routes/privacy-policy"));
const ShoppingPolicyPage = lazy(() => import("@/routes/shopping-policy"));
const ReturnExchangePolicyPage = lazy(() => import("@/routes/return-exchange-policy"));
const CareInstructionsPage = lazy(() => import("@/routes/care-instructions"));
const NotFoundPage = lazy(() => import("@/routes/not-found"));

const AdminLoginPage = lazy(() => import("@/routes/admin/login"));
const AdminDashboard = lazy(() => import("@/routes/admin/dashboard"));
const AdminProducts = lazy(() => import("@/routes/admin/products"));
const AdminCategories = lazy(() => import("@/routes/admin/categories"));
const AdminTeam = lazy(() => import("@/routes/admin/team"));
const AdminSettings = lazy(() => import("@/routes/admin/settings"));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          {/* Storefront */}
          <Route element={<StorefrontLayout />}>
            <Route index element={<HomePage />} />
            <Route path="category/:slug" element={<CategoryPage />} />
            <Route path="category/:slug/:sub" element={<SubCategoryPage />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order/success" element={<OrderSuccessPage />} />
            <Route path="about-us" element={<AboutPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="shopping-policy" element={<ShoppingPolicyPage />} />
            <Route path="return-exchange-policy" element={<ReturnExchangePolicyPage />} />
            <Route path="care-instructions" element={<CareInstructionsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin auth (public) */}
          <Route path="admin/login" element={<AdminLoginPage />} />

          {/* Admin (protected) */}
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
