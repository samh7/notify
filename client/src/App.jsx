import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import Home from "./components/home";
import ResetPasswordForm from "./components/ResetPasswordForm";
import HomePage from "./components/HomePage";
import UserAccount from "./components/UserAccount";
import SigninForm from "./components/SigninForm";

// Placeholder components (you'll replace these with your actual components)
// const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const Contact = () => <h1>Contact Page</h1>;

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:guest" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SigninForm />} />

        {/* <Route path="/reset-password" element={<ResetPasswordForm />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/account" element={<UserAccount />} /> */}
      </Routes>
    </Router>
  );
}
