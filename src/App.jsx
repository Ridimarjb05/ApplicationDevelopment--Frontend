import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import CreateInvoice from "./features/invoice/CreateInvoice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="invoice/create" element={<CreateInvoice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}