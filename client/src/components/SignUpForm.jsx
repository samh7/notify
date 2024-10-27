import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import useMyStore from "../store/store";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const { alert, setAlert } = useMyStore();
  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (e) => {
    // e.preventDefault();

    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (passwordsMatch && formData.password.length > 0) {
      // Proceed with form submission
      console.log("Form submitted:", formData);
    } else {
      console.log("Passwords do not match or are empty");
    }
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!formData.username || !formData.email || !formData.password) {
        setAlert({ type: "error", message: "All fields are required!" });
        return;
      }
      const response = await axiosInstance.post("/create-account", {
        email: formData.email || "",
        password: formData.password || "",
        username: formData.username || "",
      });
      if (response.data && response.data.accessToken) {
        // localStorage.removeItem("token");
        localStorage.setItem("token", response.data.accessToken);
        // localStorage.setItem("username", response.data.accessToken);
        setAlert({
          type: "success",
          message: "Account created successfully!",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setAlert({
          type: "error",
          message: "An error occurred!",
          // error.response.data.message
        });
      } else {
        setAlert({ type: "error", message: "An error occurred!" });
      }
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Alert />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="w-full text-center  text-[#4f46e5] text-4xl font-bold leading-9 tracking-tight ">
          Notify
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm  font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="block w-full focus:outline-none rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm  font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full focus:outline-none rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block pl-1 w-full rounded-md border-0 px-1.5 py-1.5 focus:outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block pl-1 w-full rounded-md border-0 px-1.5 py-1.5 focus:outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset 
                  ${passwordsMatch ? "focus:ring-indigo-600" : "ring-red-500"}
                  sm:text-sm sm:leading-6`}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!passwordsMatch || formData.password.length === 0}
              className="flex w-full justify-center rounded-md bg-indigo-600  px-1.5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Sign up
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already a member?{" "}
          <Link
            to="/sign-in"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
