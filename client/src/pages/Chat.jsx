import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { Send, User } from 'lucide-react';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5002');
    setSocket(newSocket);
    
    newSocket.emit('join', user._id);
    
    newSocket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    if (user.role === 'admin') {
      api.get('/users/workers').then(res => setUsers(res.data));
    } else {
      // Mock Support Admin ID or fetch from DB
      setSelectedUser({ _id: '64d3f1a0b3c1d45e99999999', name: 'Support System' });
    }
  }, [user]);

  useEffect(() => {
    if (selectedUser) {
      api.get(`/messages/conversation?userId1=${user._id}&userId2=${selectedUser._id}`)
         .then(res => {
           setMessages(res.data);
           scrollToBottom();
         }).catch(err => console.log('No previous messages or error'));
    }
  }, [selectedUser, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: newMessage
    };
    
    socket.emit('sendMessage', msgData);
    setNewMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        
        {/* Sidebar for Admin */}
        {user.role === 'admin' && (
          <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-6 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active Workers</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {users.map(u => (
                <div 
                  key={u._id} 
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 rounded-2xl cursor-pointer flex items-center transition-all ${selectedUser?._id === u._id ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-900'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 shadow-inner text-lg ${selectedUser?._id === u._id ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{u.name}</h4>
                    <p className={`text-xs font-medium uppercase tracking-wider ${selectedUser?._id === u._id ? 'text-indigo-200' : 'text-green-600'}`}>Online</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {selectedUser ? (
            <>
              <div className="px-8 py-5 bg-white border-b border-gray-100 flex items-center shadow-sm z-10">
                <div className="bg-indigo-100 text-indigo-700 w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4 shadow-inner text-lg">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedUser.name}</h2>
                  <p className="text-sm font-medium text-green-500 flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span> Available</p>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                {messages.map((m, idx) => {
                  const isMe = m.senderId === user._id || m.senderId?._id === user._id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-3xl p-5 shadow-sm text-[15px] leading-relaxed ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}`}>
                        <p className="whitespace-pre-wrap">{m.message}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 bg-white border-t border-gray-100">
                <form onSubmit={sendMessage} className="flex bg-gray-50 rounded-full p-1.5 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all shadow-inner">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-transparent px-6 py-3 focus:outline-none text-gray-800 font-medium placeholder-gray-400"
                    placeholder="Type your message here..."
                  />
                  <button type="submit" disabled={!newMessage.trim()} className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md transform hover:-translate-y-0.5 active:translate-y-0">
                    <Send size={20} className="translate-x-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <User size={48} className="text-gray-300" />
              </div>
              <p className="text-2xl font-bold text-gray-800 tracking-tight">Select a conversation</p>
              <p className="text-gray-500 mt-2">Choose a worker from the sidebar to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
