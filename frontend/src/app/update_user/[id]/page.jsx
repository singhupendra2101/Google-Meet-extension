'use client';
import axios from 'axios';
import { Formik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Quantum } from 'ldrs/react'
import 'ldrs/react/Quantum.css'
import toast from 'react-hot-toast';

const Page = () => {
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyid/${id}`)
            setUserData(res.data);
        } catch (err) {
            toast.error("Failed to fetch user data");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const submitForm = async (values, { setSubmitting }) => {
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/update/${userData._id}`, values);
            toast.success("User updated successfully");
            router.push('/manage-user');
        } catch (err) {
            toast.error("Failed to update user");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className='max-w-lg mx-auto'>
            <div>
                <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-2xs dark:bg-neutral-900 dark:border-neutral-700">
                    <div className="p-4 sm:p-7">
                        <div className="text-center">
                            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Update User</h1>
                        </div>
                        <div className="mt-5">
                            {userData ? (
                                <Formik
                                    initialValues={{
                                        name: userData.name || '',
                                        email: userData.email || '',
                                        password: userData.password || ''
                                    }}
                                    enableReinitialize
                                    onSubmit={submitForm}
                                >
                                    {(form) => (
                                        <form onSubmit={form.handleSubmit}>
                                            <div className="grid gap-y-4">
                                                <div>
                                                    <label htmlFor="name" className="block text-sm mb-2 dark:text-white">Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        name="name"
                                                        onChange={form.handleChange}
                                                        value={form.values.name}
                                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="block text-sm mb-2 dark:text-white">Email address</label>
                                                    <input
                                                        type="email"
                                                        id="email"
                                                        name="email"
                                                        onChange={form.handleChange}
                                                        value={form.values.email}
                                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="password" className="block text-sm mb-2 dark:text-white">Password</label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        onChange={form.handleChange}
                                                        value={form.values.password}
                                                        className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                                                    />
                                                </div>
                                                <button
                                                    disabled={form.isSubmitting}
                                                    type="submit"
                                                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                                                >
                                                    {form.isSubmitting ? (
                                                        <Quantum size="25" speed="1.25" color="white" />
                                                    ) : ('Update')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </Formik>
                            ) : (
                                <p className='text-center mt-5 text-gray-300'>loading....please wait </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Page;