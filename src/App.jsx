
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';

import Home from './Pages/Home/Home';
import ChatView from './Pages/ChatView/ChatView';
import ProfileScreen from './Pages/ProfileScreen';
import './index.css';

function App() {
  return (
    <Router>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<ChatView />} />
          <Route path="/chats/:contactId" element={<ChatView />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ChatProvider>
    </Router>
  );
}

export default App;
