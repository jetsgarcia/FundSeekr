"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect } from "react";
import { chatStorage } from "@/lib/chat-storage";

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<
    Array<{ from: string; text: string; timestamp: number }>
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const user = useUser();

  useEffect(() => {
    params.then(({ userId }) => setUserId(userId));
  }, [params]);

  // Load messages from IndexedDB when component mounts
  useEffect(() => {
    if (!user || !userId) return;

    const loadMessages = async () => {
      try {
        const storedMessages = await chatStorage.getMessages(user.id, userId);
        setMessages(
          storedMessages.map((msg) => ({
            from: msg.from,
            text: msg.text,
            timestamp: msg.timestamp,
          }))
        );
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();
  }, [user, userId]);

  useEffect(() => {
    if (!user || !userId) return;

    const ws = new WebSocket("wss://websocket-chat-server-myo6.onrender.com");

    ws.addEventListener("open", () => {
      ws.send(JSON.stringify({ type: "register", id: user.id }));
    });

    ws.addEventListener("message", async (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "registered") {
        console.log(`Registered as ${msg.id}`);
      } else if (msg.from) {
        const newMsg = {
          from: msg.from,
          text: msg.text,
          timestamp: Date.now(),
        };

        // Save to IndexedDB
        try {
          await chatStorage.saveMessage({
            from: msg.from,
            to: user.id,
            text: msg.text,
            timestamp: newMsg.timestamp,
          });
        } catch (error) {
          console.error("Failed to save message:", error);
        }

        // Update local state
        setMessages((prev) => [...prev, newMsg]);
      } else if (msg.type === "error") {
        console.error("Error:", msg);
      }
    });

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user, userId]);

  async function sendMessage() {
    if (!socket || !newMessage.trim() || !user) return;

    const messageData = {
      from: user.id,
      to: userId,
      text: newMessage,
      timestamp: Date.now(),
    };

    // Send via WebSocket
    socket.send(
      JSON.stringify({
        type: "message",
        to: userId,
        text: newMessage,
      })
    );

    // Save to IndexedDB
    try {
      await chatStorage.saveMessage(messageData);
    } catch (error) {
      console.error("Failed to save sent message:", error);
    }

    // Add sent message to local state
    setMessages((prev) => [
      ...prev,
      {
        from: user.id,
        text: newMessage,
        timestamp: messageData.timestamp,
      },
    ]);

    setNewMessage("");
  }

  if (!user) return <div>Please log in to chat</div>;
  if (!userId) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Chat with User: {userId}</h1>

      {/* Messages */}
      <div className="flex-1 border border-gray-300 rounded-lg p-4 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.from === user.id ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  msg.from === user.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <p>{msg.text}</p>
                <small className="opacity-75">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
