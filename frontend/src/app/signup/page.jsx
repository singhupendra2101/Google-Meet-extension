"use client";
import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// 1. Re-introducing Next.js specific imports for Image and Routing
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// 2. Import your logo file. 
// Make sure you have a 'logo.png' file inside a folder structure like: /src/images/logo.png
import logoSrc from "@/images/logo.png"; 

// The Google Client ID should be loaded from your .env.local file
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Using the Next.js router for optimized navigation
  const router = useRouter();

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
        const { confirmPassword, ...submitValues } = values;
        // FIX: Changed endpoint from /user/add to /user/signup
        await axios.post('http://localhost:5000/user/signup', submitValues);
        toast.success("✅Account created! Please Sign In now.");
        resetForm();
        setIsSignUp(false);
      } else {
        // FIX: Changed endpoint to /user/login and corrected session storage logic
        const res = await axios.post('http://localhost:5000/user/login', values);
        console.log(res.data);
        
        if (res.data?.token) {
          localStorage.setItem('user-token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.result));
        }
        toast.success("✅ Signed in successfully!");
        resetForm();
        router.replace("/dashboard");
      }
    } catch (error) {
      toast.error("❌ Error: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    toast.loading("Signing in with Google...");
    try {
      const token = credentialResponse.credential;
      const res = await axios.post(process.env.NEXT_PUBLIC_GOOGLE_LOGIN_API, { token });

      if (res.data?.token) {
        localStorage.setItem('user-token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.result));
        toast.dismiss();
        toast.success("✅ Signed in with Google successfully!");
        router.push("/dashboard"); // Changed from "/" to "/dashboard"
      }
    } catch (error) {
      toast.dismiss();
      toast.error("❌ Google Sign-In failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleGoogleError = () => {
    toast.error("❌ Google authentication failed. Please try again.");
  };

  if (!GOOGLE_CLIENT_ID) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Google Client ID is not configured. Please check your .env.local file.</p>
        </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Toaster position="top-center" reverseOrder={false} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center">
              {/* 3. Using the Next.js Image component for your logo */}
              <Image
                src={logoSrc}
                alt="MeetMinds Logo"
                width={200}
                height={50} // Adjust height as needed
                priority // Makes the logo load faster
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
          
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text={isSignUp ? "signup_with" : "signin_with"}
              shape="pill"
              width="300px"
            />
          </div>

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
    </GoogleOAuthProvider>
  );
};

export default AuthPage;

