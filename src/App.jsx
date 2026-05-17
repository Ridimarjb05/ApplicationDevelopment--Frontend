import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PurchaseHistory from "./features/history/PurchaseHistory";

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