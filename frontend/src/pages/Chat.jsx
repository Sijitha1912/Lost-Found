import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

function Chat() {
  const [searchParams] = useSearchParams();

  const matchId = searchParams.get("matchId");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUserId = "6abbe4bdecc2bf48533b90f9";

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/messages/${matchId}`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      });
  }, [matchId]);

  const handleSend = async () => {
    if (!newMessage.trim()) {
      return;
    }

    if (!matchId) {
      alert("No verified match selected.");
      return;
    }

    const messageData = {
      match: matchId,
      sender: currentUserId,
      receiver: currentUserId,
      message: newMessage.trim()
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(messageData)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages((previousMessages) => [
          ...previousMessages,
          data
        ]);

        setNewMessage("");
      } else {
        alert(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error(error);
      alert("Server connection error");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="page">
      <div className="card chat-card">
        <h1 className="page-title">Private Chat</h1>

        <p className="page-subtitle">
          Communicate securely about the matched item.
        </p>

        {!matchId && (
          <p className="success-message">
            Please open chat from a verified match.
          </p>
        )}

        <div className="chat-box">
          {loading && <p>Loading messages...</p>}

          {!loading && messages.length === 0 && (
            <p>No messages yet. Start the conversation!</p>
          )}

          {messages.map((msg) => (
            <div
              key={msg._id}
              className={
                msg.sender?._id === currentUserId ||
                msg.sender === currentUserId
                  ? "message sent"
                  : "message received"
              }
            >
              {msg.message}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!matchId}
          />

          <button
            className="primary-btn"
            onClick={handleSend}
            disabled={!matchId}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;