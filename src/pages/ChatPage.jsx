import { useState } from "react";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "Me", content: newMsg },
    ]);
    setNewMsg("");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Chats</h2>
      <div className="card p-3" style={{ height: "70vh", overflowY: "auto" }}>
        {messages.length === 0 ? (
          <p className="text-muted">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.sender}</strong>
              <p className="mb-0">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="d-flex mt-3">
        <input
          type="text"
          className="form-control me-2"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;
