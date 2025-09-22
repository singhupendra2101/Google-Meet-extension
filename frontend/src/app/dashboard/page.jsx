'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import jsPDF from 'jspdf';
import {
    LayoutDashboard, Video, FileText, Settings, Search, Sun, Moon, Download, Eye, X
} from 'lucide-react';

// --- Reusable UI Components ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const Sidebar = ({ onLogout, activeView, setActiveView }) => {
    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'notes', icon: FileText, label: 'My Notes' },
    ];

    return (
        <aside className="w-64 bg-white flex-col border-r hidden lg:flex dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">MeetNote</h1>
            </div>
            <nav className="flex-grow px-4 mt-4">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <button onClick={() => setActiveView(item.id)} className={`w-full flex items-center py-3 px-4 rounded-lg transition-colors text-left ${activeView === item.id ? 'bg-indigo-50 text-indigo-600 font-bold dark:bg-gray-700 dark:text-indigo-400' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}>
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t dark:border-gray-700">
                <button onClick={onLogout} className="w-full flex items-center py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-700">
                    <Settings className="w-5 h-5 mr-3" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

const Header = ({ user, searchTerm, setSearchTerm }) => {
    const { theme, setTheme } = useTheme();
    return (
        <header className="flex justify-between items-center p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                />
            </div>
            <div className="flex items-center space-x-4">
                <a 
                    href="https://meet.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    <Video className="w-5 h-5" />
                    <span className="hidden sm:inline">Start Meeting</span>
                </a>
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="font-semibold hidden sm:inline dark:text-gray-200">{user?.name || 'User'}</span>
                </div>
            </div>
        </header>
    );
};

const MeetingPreviewModal = ({ meeting, onClose }) => {
    if (!meeting) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col dark:bg-gray-800">
                <header className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold dark:text-white">{meeting.name || 'Meeting Details'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X className="w-6 h-6" /></button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-2 dark:text-white">Summary</h3>
                        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md dark:bg-gray-700 dark:text-gray-300">{meeting.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2 dark:text-white">Full Transcript</h3>
                        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto dark:bg-gray-700 dark:text-gray-300">{meeting.description || 'No transcript.'}</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- View-Specific Components ---

const DashboardView = ({ stats, chartData }) => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center dark:bg-gray-800 dark:border-gray-700">
                <div className="p-3 rounded-full mr-4 bg-indigo-400"><Video className="w-6 h-6 text-white" /></div>
                <div>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Total Meetings</p>
                    <p className="text-2xl font-bold dark:text-white">{stats.totalMeetings}</p>
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center dark:bg-gray-800 dark:border-gray-700">
                <div className="p-3 rounded-full mr-4 bg-cyan-400"><FileText className="w-6 h-6 text-white" /></div>
                <div>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Total Words Summarized</p>
                    <p className="text-2xl font-bold dark:text-white">{stats.totalWords.toLocaleString()}</p>
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center dark:bg-gray-800 dark:border-gray-700">
                <div className="p-3 rounded-full mr-4 bg-orange-400"><Settings className="w-6 h-6 text-white" /></div>
                <div>
                    <p className="text-gray-500 text-sm dark:text-gray-400">Avg. Words/Meeting</p>
                    <p className="text-2xl font-bold dark:text-white">{stats.avgWords.toLocaleString()}</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border h-full dark:bg-gray-800 dark:border-gray-700">
            <h3 className="font-bold text-lg mb-4 dark:text-white">Meeting Activity</h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="meetings" fill="#818cf8" name="Meetings" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </>
);

const MyNotesView = ({ meetings, onPreview, onDownloadPdf, searchTerm }) => (
    <>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-white">My Notes ({meetings.length})</h1>
        <div className="bg-white rounded-xl shadow-sm border dark:bg-gray-800 dark:border-gray-700">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b bg-gray-50 dark:bg-gray-700/50 dark:border-gray-700">
                        <tr>
                            <th className="p-4 font-semibold dark:text-gray-300">Meeting Title</th>
                            <th className="p-4 font-semibold dark:text-gray-300">Date</th>
                            <th className="p-4 font-semibold text-right whitespace-nowrap dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-gray-300">
                        {meetings.map(meeting => (
                            <tr key={meeting._id} className="border-b last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50">
                                <td className="p-4 max-w-md">
                                    <p className="font-semibold truncate">{meeting.name || 'Meeting Summary'}</p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">{meeting.summary}</p>
                                </td>
                                <td className="p-4 text-gray-600 whitespace-nowrap dark:text-gray-400">{new Date(meeting.start).toLocaleDateString()}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button onClick={() => onPreview(meeting)} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400" title="Preview">
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => onDownloadPdf(meeting)} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400" title="Download PDF">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {meetings.length === 0 && (
                <div className="text-center p-10 text-gray-500 dark:text-gray-400">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No Notes Found</h3>
                    <p className="mt-1 text-sm">
                        {searchTerm ? "Try adjusting your search." : "You haven't saved any meeting notes yet."}
                    </p>
                </div>
            )}
        </div>
    </>
);

// --- Main Dashboard Page Component ---

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [stats, setStats] = useState({ totalMeetings: 0, totalWords: 0, avgWords: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'notes'
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const token = sessionStorage.getItem('user-token');
            if (!token) {
                router.push('/signup');
                return;
            }
            try {
                const [userRes, meetingsRes] = await Promise.all([
                    fetch('http://localhost:5000/user/profile', { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch('http://localhost:5000/meetings/usermeetings', { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                if (!userRes.ok || !meetingsRes.ok) throw new Error('Auth failed');
                
                const userData = await userRes.json();
                const meetingsData = await meetingsRes.json();
                setUser(userData);
                setMeetings(meetingsData.sort((a, b) => new Date(b.start) - new Date(a.start)));
                processDashboardData(meetingsData);

            } catch (error) {
                router.push('/signup');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const processDashboardData = (meetingsData) => {
        const totalMeetings = meetingsData.length;
        const totalWords = meetingsData.reduce((acc, m) => acc + (m.description?.split(' ').length || 0), 0);
        const avgWords = totalMeetings > 0 ? Math.round(totalWords / totalMeetings) : 0;
        setStats({ totalMeetings, totalWords, avgWords });

        const meetingsByMonth = meetingsData.reduce((acc, m) => {
            const month = new Date(m.start).toLocaleString('default', { month: 'short', year: '2-digit' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});

        const formattedChartData = Object.keys(meetingsByMonth).map(key => ({ name: key, meetings: meetingsByMonth[key] })).slice(-6);
        setChartData(formattedChartData);
    };

    const handlePreview = (meeting) => setSelectedMeeting(meeting);

    const handleDownloadPdf = (meeting) => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(meeting.name || 'Meeting Summary', 15, 20);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Date: ${new Date(meeting.start).toLocaleString()}`, 15, 30);
        
        let y = 45;
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text('Summary', 15, y);
        y += 8;
        doc.setFontSize(11);
        const summaryLines = doc.splitTextToSize(meeting.summary || 'N/A', 180);
        doc.text(summaryLines, 15, y);
        y += summaryLines.length * 5 + 10;

        if (y > 270) { doc.addPage(); y = 20; }

        doc.setFontSize(14);
        doc.text('Full Transcript', 15, y);
        y += 8;
        doc.setFontSize(10);
        const transcriptLines = doc.splitTextToSize(meeting.description || 'N/A', 180);
        transcriptLines.forEach(line => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 15, y);
            y += 5;
        });

        doc.save(`meeting-notes-${meeting.code || meeting._id}.pdf`);
    };

    const handleLogout = () => {
        sessionStorage.removeItem('user-token');
        router.push('/');
    };

    const filteredMeetings = meetings.filter(meeting => 
        (meeting.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (meeting.summary?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (meeting.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            <Sidebar onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 dark:bg-gray-900">
                    {activeView === 'dashboard' ? (
                        <DashboardView stats={stats} chartData={chartData} />
                    ) : (
                        <MyNotesView 
                            meetings={filteredMeetings} 
                            onPreview={handlePreview} 
                            onDownloadPdf={handleDownloadPdf}
                            searchTerm={searchTerm}
                        />
                    )}
                </main>
            </div>
            {selectedMeeting && <MeetingPreviewModal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />}
        </div>
    );
};

export default DashboardPage;