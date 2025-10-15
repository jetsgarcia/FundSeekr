"use client";

import { useUser } from "@stackframe/stack";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { chatStorage } from "@/lib/chat-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isLoadingUserName, setIsLoadingUserName] = useState<boolean>(true);
  const [messages, setMessages] = useState<
    Array<{ from: string; text: string; timestamp: number }>
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const router = useRouter();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to fetch user name
  const fetchUserName = async (id: string) => {
    setIsLoadingUserName(true);
    try {
      const response = await fetch(`/api/users/${id}/name`);
      if (response.ok) {
        const data = await response.json();
        setUserName(data.name || `User: ${id}`);
      } else {
        setUserName(`User: ${id}`);
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      setUserName(`User: ${id}`);
    } finally {
      setIsLoadingUserName(false);
    }
  };

  useEffect(() => {
    params.then(({ userId }) => {
      setUserId(userId);
      fetchUserName(userId);
    });
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="p-6">
          <CardContent className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-muted-foreground">
              Please log in to access the chat
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto p-4 space-y-4">
      {/* Header with back button */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              {isLoadingUserName ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse h-6 bg-muted rounded w-32"></div>
                </div>
              ) : (
                userName
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Chat conversation
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardContent className="flex-1 p-0 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <MessageCircle className="h-16 w-16 text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-medium">No messages yet</h3>
                  <p className="text-muted-foreground">
                    Start the conversation by sending a message below
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.from === user.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.from === user.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <div className="flex justify-end mt-1">
                        <small
                          className={`text-xs ${
                            msg.from === user.id
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card>
        <CardContent className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              disabled={!newMessage.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
