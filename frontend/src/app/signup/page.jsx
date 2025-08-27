"use client";
import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
// ❌ Removed: import { useRouter } from "next/navigation";
// ✅ Using window.location for redirection instead of Next.js router.
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

// ✅ Google Icon as an SVG component to remove dependency
const FcGoogle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" width="24" height="24">
    <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.175-26.686 30.175-16.247 0-29.57-13.317-29.57-29.57s13.323-29.57 29.57-29.57c9.283 0 14.637 3.826 18.244 7.443l38.229-38.229C196.353 37.188 165.798 26 130.55 26c-50.99 0-92.83 42.138-92.83 92.83s41.84 92.83 92.83 92.83c52.43 0 90.88-38.229 90.88-91.213 0-6.376-.586-12.29-.86-17.007z" />
  </svg>
);


const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  // ❌ Removed: const router = useRouter();

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().min(3, "Too Short!").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
  });

  const SignInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Password too short").required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      let submitValues = { ...values };
      
      if (isSignUp) {
        await axios.post("http://localhost:5000/user/add", submitValues);
        toast.success("✅ Account created! Please Sign In now.");
        resetForm();
        setIsSignUp(false);

      } else {
        await axios.post("http://localhost:5000/user/authenticate", submitValues);
        toast.success("✅ Signed in successfully!");
        resetForm();
        // ✅ Redirect using standard browser API
        window.location.href = "/"; 
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 relative overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      
      <motion.h1
        initial={{ opacity: 0, y: -60, scale: 0.8 }}
        animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", repeat: Infinity, repeatDelay: 4 }}
        className="relative text-6xl font-extrabold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        <span className="animate-text-shimmer bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          MeetMinds
        </span>
        <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></span>
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="text-gray-600 text-lg font-medium mb-10"
      >
        Connect • Collaborate • Create
      </motion.p>

      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-60"
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full z-10 backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={isSignUp ? SignUpSchema : SignInSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-4">
              {isSignUp && (
                <div>
                  <div className="flex items-center border rounded-lg px-3 py-2">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    <Field
                      name="name"
                      placeholder="Name"
                      className="flex-1 outline-none"
                    />
                  </div>
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>
              )}

              <div>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    name="email"
                    placeholder="Email"
                    type="email"
                    className="flex-1 outline-none"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  <Field
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="flex-1 outline-none"
                  />
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg shadow-lg hover:opacity-90 transition"
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
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg shadow-md hover:bg-gray-50 transition"
        >
          <FcGoogle />
          <span className="ml-2">{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
        </motion.button>

        <p className="mt-4 text-center text-gray-600">
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
