import { BrowserRouter, Routes, Route } from "react-router-dom"
import PrivateRoute from "./PrivateRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import DetailPost from "./pages/DetailPost"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="thread/:id" element={<DetailPost />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}