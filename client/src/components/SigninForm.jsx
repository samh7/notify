import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Alert from "./Alert";
import useMyStore from "../store/store";
import { useEffect } from "react";

export default function SigninForm() {
  const { alert, setAlert } = useMyStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData.email, formData.password);
  };

  const navigate = useNavigate();
  // API CALL
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        email: formData.email || "",
        password: formData.password || "",
      });
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        setAlert({
          type: "success",
          message: "Logged in successfully!",
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
    <>
      <Alert />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="w-full text-center  text-[#4f46e5] text-4xl font-bold leading-9 tracking-tight ">
            Notify
          </div>
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  value={formData.email}
                  onChange={handleInputChange}
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full px-1.5 focus:outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    to="/reset-password"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  value={formData.password}
                  onChange={handleInputChange}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full px-1.5 focus:outline-none rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                // onClick={handleLogin}
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 flex items-start  justify-center  text-sm text-gray-500">
            Not a member?{" "}
            <div className="flex -mt-[2px] ml-4 flex-col items-start justify-start">
              <Link
                to="/sign-up"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Get started today
              </Link>
              <Link
                to="/guest"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Try as a guest
              </Link>
            </div>
          </p>
        </div>
      </div>
    </>
  );
}
