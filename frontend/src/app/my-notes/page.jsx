'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import jsPDF from 'jspdf';
import {
    LayoutDashboard, FileText, Settings, Search, Bell, ChevronDown, Download, Eye, X
} from 'lucide-react';

// --- Reusable UI Components ---

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);

const Sidebar = () => {
    const pathname = usePathname();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: FileText, label: 'My Notes', href: '/my-notes' },
    ];

    return (
        <aside className="w-64 bg-white flex-col border-r hidden lg:flex">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-600">MeetNote</h1>
            </div>
            <nav className="flex-grow px-4 mt-4">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.label}>
                            <Link href={item.href} className={`flex items-center py-3 px-4 rounded-lg transition-colors ${pathname === item.href ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t">
                <a href="#" className="flex items-center py-3 px-4 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                </a>
            </div>
        </aside>
    );
};

const Header = ({ user, searchTerm, setSearchTerm }) => (
    <header className="flex justify-between items-center p-6 bg-white border-b">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search notes..." 
                className="pl-10 pr-4 py-2 rounded-lg border focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-500" />
            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center font-bold text-indigo-600">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-semibold hidden sm:inline">{user?.name || 'User'}</span>
                <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
        </div>
    </header>
);

const MeetingPreviewModal = ({ meeting, onClose }) => {
    if (!meeting) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">{meeting.name || 'Meeting Details'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X className="w-6 h-6" /></button>
                </header>
                <main className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-2">Summary</h3>
                        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">{meeting.summary}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Full Transcript</h3>
                        <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md max-h-80 overflow-y-auto">{meeting.description || 'No transcript.'}</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

// --- Main My Notes Page Component ---

const MyNotesPage = () => {
    const [user, setUser] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
                
                setUser(await userRes.json());
                setMeetings(await meetingsRes.json());
            } catch (error) {
                router.push('/signup');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const handlePreview = (meeting) => setSelectedMeeting(meeting);

    const handleDownloadPdf = (meeting) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const margin = 15;
        let y = 20;

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(meeting.name || 'Meeting Summary', margin, y);
        y += 10;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text(`Date: ${new Date(meeting.start).toLocaleString()}`, margin, y);
        y += 15;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary', margin, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0);
        const summaryLines = doc.splitTextToSize(meeting.summary || 'No summary available.', pageWidth - margin * 2);
        doc.text(summaryLines, margin, y);
        y += summaryLines.length * 5 + 10;

        if (y > pageHeight - 40) {
            doc.addPage();
            y = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Full Transcript', margin, y);
        y += 8;

        doc.setFontSize(10);
        const transcriptLines = doc.splitTextToSize(meeting.description || 'No transcript available.', pageWidth - margin * 2);
        
        transcriptLines.forEach(line => {
            if (y > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += 5;
        });

        doc.save(`meeting-notes-${meeting.code || meeting._id}.pdf`);
    };

    const filteredMeetings = meetings.filter(
        (meeting) =>
            (meeting.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (meeting.summary?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (meeting.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">My Notes ({filteredMeetings.length})</h1>
                    <div className="bg-white rounded-xl shadow-sm border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="p-4 font-semibold">Meeting Title</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold text-right whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMeetings.map(meeting => (
                                        <tr key={meeting._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                            <td className="p-4 max-w-md">
                                                <p className="font-semibold truncate">{meeting.name || 'Meeting Summary'}</p>
                                                <p className="text-sm text-gray-500 truncate">{meeting.summary}</p>
                                            </td>
                                            <td className="p-4 text-gray-600 whitespace-nowrap">{new Date(meeting.start).toLocaleDateString()}</td>
                                            <td className="p-4 whitespace-nowrap">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button onClick={() => handlePreview(meeting)} className="p-2 text-gray-500 hover:text-indigo-600" title="Preview">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDownloadPdf(meeting)} className="p-2 text-gray-500 hover:text-indigo-600" title="Download PDF">
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {filteredMeetings.length === 0 && (
                            <div className="text-center p-10 text-gray-500">
                                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No Notes Found</h3>
                                <p className="mt-1 text-sm">
                                    {searchTerm ? "Try adjusting your search." : "You haven't saved any meeting notes yet."}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
            {selectedMeeting && <MeetingPreviewModal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />}
        </div>
    );
};

export default MyNotesPage;