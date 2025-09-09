"use client";
import React, { useState } from "react";
// Eye aur EyeOff icons ko import kiya gaya hai
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// 1. Import the Image component and your logo
import Image from "next/image";
// Corrected the path to the logo
import logoSrc from "@/images/logo.png"; // Assumes '@/' is configured to point to your 'src' folder

// Google Icon SVG component
const FcGoogle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" width="24" height="24">
    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.175-26.686 30.175-16.247 0-29.57-13.317-29.57-29.57s13.323-29.57 29.57-29.57c9.283 0 14.637 3.826 18.244 7.443l38.229-38.229C196.353 37.188 165.798 26 130.55 26c-50.99 0-92.83 42.138-92.83 92.83s41.84 92.83 92.83 92.83c52.43 0 90.88-38.229 90.88-91.213 0-6.376-.586-12.29-.86-17.007z" />
  </svg>
);

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  // Password visibility ke liye state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Signup validation mein confirmPassword add kiya gaya hai
  const SignUpSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required("Required"),
  });

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isSignUp) {
        // confirmPassword ko backend par bhejne ki zaroorat nahi
        const { confirmPassword, ...submitValues } = values;
        await axios.post("http://localhost:5000/user/add", submitValues);
        toast.success("✅ Account created! Please Sign In now.");
        resetForm();
        setIsSignUp(false);
      } else {
        const res = await axios.post("http://localhost:5000/user/login", values);
        if (res.data?.token) {
          localStorage.setItem('token', res.data.token)
        }
        toast.success("✅ Signed in successfully!");
        resetForm();
        router.push("/");
      }
    } catch (error) {
      toast.error("❌ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    toast("🚀 Google Sign-In clicked! (Connect backend here)");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Toaster position="top-center" reverseOrder={false} />

        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full"
        >
            <div className="text-center mb-8">
                {/* 2. Replace the h1 text with the Image component */}
                <div className="flex justify-center">
                    <Image
                        src={logoSrc}
                        alt="MeetMinds Logo"
                        width={200}  // Adjust size as needed
                        height={100} // Adjust size as needed
                        priority
                    />
                </div>
                <p className="text-gray-500 mt-4 text-sm font-medium">
                    Connect • Collaborate • Create
                </p>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h2>

            <Formik
            initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
            validationSchema={isSignUp ? SignUpSchema : SignInSchema}
            onSubmit={handleSubmit}
            >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                {isSignUp && (
                    <div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <Field name="name" placeholder="Name" className="flex-1 outline-none bg-transparent" />
                    </div>
                    <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                )}

                <div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    <Field name="email" placeholder="Email" type="email" className="flex-1 outline-none bg-transparent" />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Password Field with Eye Icon */}
                <div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <Lock className="w-5 h-5 text-gray-400 mr-2" />
                    <Field
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="flex-1 outline-none bg-transparent"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                </div>

                {/* Confirm Password Field (Only for Signup) */}
                {isSignUp && (
                    <div>
                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                        <Lock className="w-5 h-5 text-gray-400 mr-2" />
                        <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="flex-1 outline-none bg-transparent"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                )}

                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg shadow-lg hover:opacity-90 transition font-semibold"
                >
                    {isSignUp ? "Create Account" : "Sign In"}
                </motion.button>
                </Form>
            )}
            </Formik>

            <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center border border-gray-300 py-2.5 rounded-lg shadow-md hover:bg-gray-50 transition"
            >
            <FcGoogle />
            <span className="ml-2 text-gray-700 font-medium">{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
            </motion.button>

            <p className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don’t have an account?"}
            <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-blue-600 font-semibold hover:underline"
            >
                {isSignUp ? "Sign In" : "Sign Up"}
            </button>
            </p>
        </motion.div>
    </div>
  );
};

export default AuthPage;

