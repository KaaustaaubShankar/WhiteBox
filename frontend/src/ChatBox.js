import React from 'react';

const ChatBox = () => {
  return (
    <div className="chat-box-content">
      <h2>Chat Box</h2>
      <div className="chat-messages">
        <p>Chat messages will appear here.</p>
        {/* Add chat message logic here */}
      </div>
      <textarea placeholder="Type your message here..."></textarea>
      <button>Send</button>
    </div>
  );
};

export default ChatBox;
