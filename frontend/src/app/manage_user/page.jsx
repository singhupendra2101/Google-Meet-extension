'use client';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

const ManageUser = () => {
    const [userList, setuserList] = useState([]);


    const fetchuser = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        try {
            const res = await axios.get(`${apiUrl}/user/getall`);
            console.table(res.data);
            setuserList(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchuser();
    }, []);

    const deleteUser = async (id) => {
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/delete/${id}`)

            .then((result) => {
                toast.success("User deleted successfully");
                fetchuser(); // Refresh the user list after deletion
            }).catch((err) => {
                console.error(err);
                toast.error("Failed to delete user");

            });
    }

    return (
        <div>
            <div className='container mx-auto mt-5'>
                <h1 className='text-center font-bold text-3xl '> Manage User</h1>
                <table className='w-full mt-5 border ' >
                    <thead>
                        <tr>
                            <th className='p-3'>ID</th>
                            <th className='p-3'>Name</th>
                            <th className='p-3'>Email</th>

                            <th className='p-3'>createdAt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <td className='p-2 border border-gray-300'>{user._id}</td>
                                    <td className='p-2 border border-gray-300'>{user.name}</td>
                                    <td className='p-2 border border-gray-300'>{user.email}</td>
                                    <td className='p-2 border border-gray-300'>{user.city}</td>
                                    <td className='p-2 border border-gray-300'>{user.createAt}</td>
                                    <td className='p-2 border border-gray-300'>

                                        <button className='bg-red-500 text-white px-3 py-1 rounded-lg'
                                            onClick={() => deleteUser(user._id)} >

                                            <IconTrash />
                                        </button>
                                    </td>
                                    <td className='p-2 border border-gray-300'>
                                        <Link className='block w-fit bg-blue-500 text-white px-3 py-1 rounded-lg'
                                            href={'/update-user/' + user._id} >

                                            <IconPencil />
                                        </Link>
                                    </td>

                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default ManageUser;