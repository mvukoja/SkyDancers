import React, { useState, useEffect } from 'react';
import { db } from '../../firebase-config';
import { collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import './Chat.css';
import { Link } from "react-router-dom"; // Add this import
import headerlogo from "../Assets/header-logo.png"; // Add this import

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);


  const getCurrentUserId = async () => {
  const currentUser = getCurrentUser(); // Get the current user's info from the decoded JWT
  if (!currentUser || !currentUser.sub) {
    console.error('No current user found.');
    return null;
  }

  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error('No token found');
    return null;
  }

  try {
    const response = await fetch(`http://localhost:8080/users/searchuser/${currentUser.sub}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].type.userid; // Assuming that the API returns the `userid` field for the current user
    } else {
      console.error('Current user not found in the response data.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching current user ID:', error);
    return null;
  }
};

  const getCurrentUser = () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const searchUsers = async (username) => {
    try {
      if (!username.trim()) {
        setUsers([]);
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`http://localhost:8080/users/searchuser/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const currentUser = getCurrentUserId();
      const filteredUsers = Array.isArray(data)
        ? data.filter((user) => user.type.userid !== currentUser)
        : [];
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length >= 2) {
      searchUsers(value);
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;
  
    const fetchCurrentUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };
    fetchCurrentUserId();

    const fetchMessages = async () => {
      const currentUser = await getCurrentUserId(); // Wait for the async result
      if (!currentUser) {
        console.error('No current user found.');
        return;
      }
  
      const q = query(
        collection(db, 'messages'),
        where('participants', '==', [currentUser, String(selectedUser.type.userid)].sort().join('_')),
        orderBy('createdAt', 'asc')
      );
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });
  
      return () => {
        unsubscribe();
        setMessages([]);
      };
    };
  
    fetchMessages();
  }, [selectedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUser) return;
  
    const currentUser = await getCurrentUser(); // Ensure async call is used here
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }
  
    try {
      const currentUserId = await getCurrentUserId();
      // Use currentUser.userid here, assuming currentUser contains the id
      const participantString = [String(currentUserId), String(selectedUser.type.userid)].sort().join('_');
      console.log(currentUserId);
      console.log(selectedUser.type.userid);
  
      const messageData = {
        text: String(newMessage),
        createdAt: new Date().toISOString(),
        senderId: String(currentUserId),
        senderName: String(currentUser.sub),
        receiverId: String(selectedUser.type.userid),
        receiverName: `${selectedUser.name} ${selectedUser.surname}`,
        participants: participantString,
      };
  
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, messageData);
  
      setNewMessage(''); // Reset input after sending
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };
  

  return (
    <div className="container">
    {/* Add the header here */}
    <div>
    <header className="homepage-header">
      <a href="/" className="logo">
        <img src={headerlogo} alt="" className="logo-img" />
      </a>

      <div className="header-links">
        <Link to="/" className="login">
          <button>Početna</button>
        </Link>
      </div>
    </header>
    </div>
    <div className="chat-container">
      <div className="users-list">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="search-results">
          {users.map((user) => (
            <div
              key={user.type.userid}
              className={`user-item ${selectedUser?.type?.userid === user.type.userid ? 'selected' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name} {user.surname} ({user.type?.type})
            </div>
          ))}
        </div>
      </div>
      <div className="chat-main">
      {selectedUser ? (
        <>
          <div className="chat-header">Chat with {selectedUser.name}</div>
          <div className="messages-container">
  {messages.map((msg) => (
    <div
      key={msg.id}
      className={`message ${msg.senderId === String(currentUserId) ? 'sent' : 'received'}`}
    >
      <div className="message-text">{msg.text}</div>
      <div className="message-meta">
        <span>{msg.senderName}</span>
        <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  ))}
</div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </>
        ) : (
          <div>Select a user to start chatting</div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Chat;