import React, { useState, useEffect } from 'react';
import { fetchMentors, fetchMySessions, loginUser, registerUser, bookSession, updateSessionStatus } from './services/api';
import { BookOpen, LogOut, Search, Video, X } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', department: 'Computer Science' });
  const [authError, setAuthError] = useState('');

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingTopic, setBookingTopic] = useState('');
  const [bookingDuration, setBookingDuration] = useState(30);
  const [bookingMode, setBookingMode] = useState('Campus Spot');

  // Video Call State
  const [activeVideoSession, setActiveVideoSession] = useState(null);

  useEffect(() => {
    loadMentors();
    if (user) loadSessions();
  }, [user]);

  const loadMentors = async () => {
    try {
      const { data } = await fetchMentors();
      setMentors(data);
    } catch (err) {
      console.error('Failed to load mentors:', err);
    }
  };

  const loadSessions = async () => {
    try {
      const { data } = await fetchMySessions();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = isRegister ? await registerUser(formData) : await loginUser(formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    try {
      const meetingRoom = bookingMode === 'Online' 
        ? `https://meet.jit.si/PeerSkillSwap-${Date.now()}` 
        : 'Library 2nd Floor';

      await bookSession({
        mentorId: selectedMentor._id,
        topic: bookingTopic,
        duration: Number(bookingDuration),
        mode: bookingMode,
        scheduledTime: new Date(Date.now() + 3600000 * 24).toISOString(),
        meetingLocation: meetingRoom
      });
      alert('Session request sent successfully!');
      setSelectedMentor(null);
      setBookingTopic('');
      loadSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book session');
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await updateSessionStatus(sessionId, status);
      loadSessions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update session');
    }
  };

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.skillsToTeach?.some(s => s.skill.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <header style={{ maxWidth: '1100px', margin: '0 auto 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen style={{ color: '#2563eb' }} size={28} />
          <h1 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>Peer Skill Swap</h1>
        </div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: '#eff6ff', padding: '6px 14px', borderRadius: '20px', color: '#2563eb', fontWeight: 600, fontSize: '14px' }}>
              ⚡ Credits: {user.credits ?? 10}
            </div>
            <span style={{ fontWeight: 500, color: '#334155' }}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '14px', color: '#64748b' }}>Campus Micro-Mentorship Platform</span>
        )}
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {!user ? (
          <div style={{ maxWidth: '400px', margin: '40px auto', background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginTop: 0 }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
            {authError && <div style={{ color: '#ef4444', marginBottom: '12px', fontSize: '14px' }}>{authError}</div>}
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {isRegister && (
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              )}
              <input 
                type="email" 
                placeholder="College Email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})}
                required 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})}
                required 
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
              <button type="submit" style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                {isRegister ? 'Register' : 'Login'}
              </button>
            </form>
            <p style={{ fontSize: '14px', textAlign: 'center', marginTop: '16px', color: '#64748b' }}>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span onClick={() => setIsRegister(!isRegister)} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
                {isRegister ? 'Login' : 'Register'}
              </span>
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button 
                onClick={() => setActiveTab('browse')}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'browse' ? '#2563eb' : '#fff', color: activeTab === 'browse' ? '#fff' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
              >
                Find Mentors
              </button>
              <button 
                onClick={() => setActiveTab('sessions')}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === 'sessions' ? '#2563eb' : '#fff', color: activeTab === 'sessions' ? '#fff' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
              >
                My Sessions ({sessions.length})
              </button>
            </div>

            {activeTab === 'browse' ? (
              <div>
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#94a3b8' }} />
                  <input 
                    type="text"
                    placeholder="Search by skill (e.g. C++, Python, Circuit Analysis)..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 42px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {filteredMentors.length === 0 ? (
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', gridColumn: '1/-1', textAlign: 'center', color: '#64748b' }}>
                      No peer mentors found.
                    </div>
                  ) : filteredMentors.map(m => (
                    <div key={m._id} style={{ background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{m.name}</h3>
                          <span style={{ fontSize: '13px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                            ⭐ {m.reputation || 5.0}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 12px', fontSize: '13px', color: '#64748b' }}>{m.department}</p>
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                          {m.skillsToTeach?.map((st, idx) => (
                            <span key={idx} style={{ background: '#dbeafe', color: '#1e40af', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 500 }}>
                              {st.skill} ({st.level})
                            </span>
                          ))}
                        </div>
                      </div>

                      {user.id !== m._id && (
                        <button 
                          onClick={() => setSelectedMentor(m)}
                          style={{ width: '100%', padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Request 15-45 Min Session
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '20px' }}>
                <h3 style={{ marginTop: 0 }}>Scheduled Micro-Mentorship Sessions</h3>
                {sessions.length === 0 ? <p style={{ color: '#64748b' }}>No sessions booked yet.</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sessions.map(s => {
                      const isMentor = s.mentor?._id === user.id;
                      const isOnline = s.mode === 'Online';
                      const isAccepted = s.status === 'accepted';
                      const meetingUrl = s.meetingLocation?.startsWith('http') 
                        ? s.meetingLocation 
                        : `https://meet.jit.si/PeerSkillSwap-${s._id}`;

                      return (
                        <div key={s._id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h4 style={{ margin: 0 }}>{s.topic}</h4>
                              {isMentor && <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>YOU ARE TEACHING</span>}
                            </div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#64748b' }}>
                              Learner: {s.learner?.name} | Mentor: {s.mentor?.name}
                            </p>
                            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>
                              {s.duration} mins • {s.mode} ({s.meetingLocation})
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <span style={{ 
                              background: s.status === 'accepted' ? '#dcfce7' : s.status === 'cancelled' ? '#fee2e2' : '#fef3c7', 
                              color: s.status === 'accepted' ? '#166534' : s.status === 'cancelled' ? '#991b1b' : '#92400e', 
                              padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 
                            }}>
                              {s.status.toUpperCase()}
                            </span>

                            {/* Show 1-on-1 Video Call Button if Accepted & Online */}
                            {isAccepted && isOnline && (
                              <button 
                                onClick={() => setActiveVideoSession({ ...s, videoUrl: meetingUrl })}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                              >
                                <Video size={16} /> Join Video Room
                              </button>
                            )}

                            {/* Show Accept/Decline ONLY if logged-in user is Mentor and pending */}
                            {isMentor && s.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => handleStatusUpdate(s._id, 'accepted')} style={{ padding: '6px 12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                                  Accept
                                </button>
                                <button onClick={() => handleStatusUpdate(s._id, 'cancelled')} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {selectedMentor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '450px' }}>
            <h3 style={{ marginTop: 0 }}>Book Session with {selectedMentor.name}</h3>
            <form onSubmit={handleBookSession} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>What concept/bug do you need help with?</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g., Recursion in C++, Figma auto-layout"
                  value={bookingTopic} 
                  onChange={e => setBookingTopic(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>Session Duration</label>
                <select 
                  value={bookingDuration} 
                  onChange={e => setBookingDuration(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value={15}>15 Minutes (Quick bug fix)</option>
                  <option value={30}>30 Minutes (Concept review)</option>
                  <option value={45}>45 Minutes (Deep dive)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 500 }}>Meeting Mode</label>
                <select 
                  value={bookingMode} 
                  onChange={e => setBookingMode(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Campus Spot">On-Campus Spot (Library / Canteen)</option>
                  <option value="Online">Online 1-on-1 Video Call</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  Confirm Booking (1 Credit)
                </button>
                <button type="button" onClick={() => setSelectedMentor(null)} style={{ padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-on-1 Embedded Video Call Modal */}
      {activeVideoSession && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.95)', display: 'flex', flexDirection: 'column', zIndex: 1000, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', marginBottom: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>🎥 1-on-1 Session: {activeVideoSession.topic}</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                Learner: {activeVideoSession.learner?.name} | Mentor: {activeVideoSession.mentor?.name}
              </p>
            </div>
            <button 
              onClick={() => setActiveVideoSession(null)}
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, cursor: 'pointer' }}
            >
              <X size={18} /> End Call
            </button>
          </div>

          <iframe 
            src={activeVideoSession.videoUrl}
            title="Peer Skill Swap Video Room"
            allow="camera; microphone; display-capture; autoplay; clipboard-write"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', background: '#000' }}
          />
        </div>
      )}
    </div>
  );
}
