import React, { useCallback, useState, useEffect, useRef } from "react";
import { db } from "../../firebase-config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";
import "./Chat.css";
import { Link } from "react-router-dom";
import headerlogo from "../Assets/header-logo.png";

//Stranica za chat s drugim korisnicima
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  //Funkcija za dohvaćanje ID trenutnog korisnika
  const getCurrentUserId = useCallback(async () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.sub) {
      console.error("No current user found.");
      return null;
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No token found");
      return null;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/users/searchuser/${currentUser.sub}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return data[0].id;
      } else {
        console.error("Current user not found in the response data.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching current user ID:", error);
      return null;
    }
  }, []);

  //Funkcija za dohvaćanje trenutnog korisnika
  const getCurrentUser = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  //Funkcija za pretragu korisnika po username
  const searchUsers = async (username) => {
    try {
      if (!username.trim()) {
        setUsers([]);
        return;
      }

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/users/searchuser/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const currentUser = await getCurrentUserId();
      if (!currentUser) {
        console.error("No current user ID found.");
        setUsers([]);
        return;
      }
      const filteredUsers = Array.isArray(data)
        ? data.filter((user) => user.id !== currentUser && !user.inactive)
        : [];

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
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

    //Funkcija za dohvaćanje ID korisnika
    const fetchCurrentUserId = async () => {
      const userId = await getCurrentUserId();
      setCurrentUserId(userId);
    };
    fetchCurrentUserId();

    //Funkcija za dohvat svih poruka
    const fetchMessages = async () => {
      const currentUser = await getCurrentUserId();
      if (!currentUser) {
        console.error("No current user found.");
        return;
      }

      const q = query(
        collection(db, "messages"),
        where(
          "participants",
          "==",
          [currentUser, String(selectedUser.id)].sort().join("_")
        ),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
        scrollToBottom();
      });

      return () => {
        unsubscribe();
        setMessages([]);
      };
    };

    fetchMessages();
  }, [selectedUser, getCurrentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //Funkcija za slanje poruke
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedUser) return;

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      window.location.href = "/login";
      return;
    }

    try {
      const currentUserId = await getCurrentUserId();
      const participantString = [String(currentUserId), String(selectedUser.id)]
        .sort()
        .join("_");

      const messageData = {
        text: String(newMessage),
        createdAt: new Date().toISOString(),
        senderId: String(currentUserId),
        senderName: String(currentUser.sub),
        receiverId: String(selectedUser.id),
        receiverName: `${selectedUser.name} ${selectedUser.surname}`,
        participants: participantString,
      };

      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, messageData);

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message. Please try again.");
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("selectedUser");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setSelectedUser(user);
      localStorage.removeItem("selectedUser");
    }
  }, []);

  return (
    <div>
      <header className="homepage-header">
        <a href="/" className="logo">
          <img src={headerlogo} alt="" className="logo-img" />
        </a>

        <div className="header-links">
          <Link to="/" className="login">
            <button>Početna</button>
          </Link>
          <Link to="/logout" className="logout">
            <button>Odjava</button>
          </Link>
        </div>
      </header>

      <div className="chat-container">
        <h1>Chat</h1>
        <div className="users-list">
          <input
            type="text"
            placeholder="Pretraga korisnika..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="chat-input"
          />
          <div className="search-results">
            {users.map((user) => (
              <div
                key={user.id}
                className={`user-item ${
                  selectedUser?.type?.userid === user.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  setSearchTerm("");
                  setUsers([]);
                }}
              >
                {user.username}
                {":"} {user.name} {user.surname} (
                {user.type.type === "DANCER"
                  ? "Plesač"
                  : user.type.type === "DIRECTOR"
                  ? "Direktor"
                  : "Admin"}
                )
              </div>
            ))}
          </div>
        </div>
        <div className="chat-main">
          <hr />
          {selectedUser ? (
            <>
              <div className="chat-header">
                <strong>Chat sa:</strong> {selectedUser.name}
              </div>
              <br />
              <div className="messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${
                      msg.senderId === String(currentUserId)
                        ? "sent"
                        : "received"
                    }`}
                  >
                    <div className="message-text">{msg.text}</div>
                    <div className="message-meta">
                      <span>{msg.senderName}</span> {" u "}
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Napišite svoju poruku..."
                  className="chat-input"
                />
                <button className="message-button" type="submit">
                  Pošalji
                </button>
              </form>
            </>
          ) : (
            <div>Izaberite korisnika za početak razgovora:</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
