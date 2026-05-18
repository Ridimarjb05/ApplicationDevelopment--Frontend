import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PurchaseHistory from "./pages/customer/PurchaseHistory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="customer/history" element={<PurchaseHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}