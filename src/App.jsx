import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <h1 className="text-2xl font-bold">Welcome to VehicleParts</h1>
      </Layout>
    </BrowserRouter>
  );
}