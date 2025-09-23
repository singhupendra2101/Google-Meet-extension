"use client"; // This is a client component

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Info, User } from 'lucide-react';

const MyMeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You need to be logged in to view your meetings.");
        router.push('/signup'); // Redirect to signup/login if no token
        return;
      }

      setLoading(true);
      try {
        // Replace with your actual backend API endpoint for fetching user-specific meetings
        const response = await axios.get('http://localhost:5000/meetings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMeetings(response.data);
        toast.success("Meetings loaded successfully!");
      } catch (error) {
        console.error("Error fetching meetings:", error);
        toast.error("Failed to fetch meetings: " + (error.response?.data?.message || error.message));
        // Optionally redirect if token is invalid or expired
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          router.push('/signup');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [router]); // Dependency array includes router to avoid lint warnings

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Toaster />
        <p className="text-lg text-gray-600">Loading your meetings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster />
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Scheduled Meetings</h1>

        {meetings.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">You have no upcoming meetings. Why not create one?</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <div key={meeting._id} className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h2 className="text-xl font-semibold text-blue-800 mb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  {meeting.title}
                </h2>
                <p className="text-gray-700 mb-3">{meeting.description}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Date: {new Date(meeting.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    Time: {meeting.time}
                  </p>
                  {/* Assuming 'creator' or 'host' field exists and is an object with a 'name' */}
                  {meeting.creator?.name && (
                    <p className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      Host: {meeting.creator.name}
                    </p>
                  )}
                  {/* Add more meeting details as needed, e.g., participants, link */}
                  {meeting.meetingLink && (
                    <p className="flex items-center">
                      <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        Join Meeting
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMeetingsPage;