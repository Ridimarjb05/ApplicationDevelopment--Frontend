import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoyaltyProgram from "./features/loyalty/LoyaltyProgram";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="customer/loyalty" element={<LoyaltyProgram />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}