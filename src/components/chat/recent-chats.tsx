"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useState } from "react";
import Link from "next/link";
import { chatStorage } from "@/lib/chat-storage";

interface ChatContact {
  userId: string;
  userName?: string;
  lastMessage?: string;
  timestamp?: number;
}

export default function RecentChats() {
  const user = useUser();
  const [contacts, setContacts] = useState<ChatContact[]>([]);

  // Function to fetch and cache user name
  const fetchUserName = async (userId: string): Promise<string> => {
    try {
      const response = await fetch(`/api/users/${userId}/name`);
      if (response.ok) {
        const data = await response.json();
        return data.name || `User: ${userId}`;
      } else {
        console.error("Failed to fetch user name:", response.statusText);
        return `User: ${userId}`;
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return `User: ${userId}`;
    }
  };

  // Load contacts from IndexedDB when component mounts
  useEffect(() => {
    if (!user) return;

    const loadContacts = async () => {
      try {
        const storedContacts = await chatStorage.getContacts();
        const contactsWithNames = await Promise.all(
          storedContacts.map(async (contact) => {
            const userName = await fetchUserName(contact.userId);
            return {
              userId: contact.userId,
              userName: userName,
              lastMessage: contact.lastMessage,
              timestamp: contact.timestamp,
            };
          })
        );
        setContacts(contactsWithNames);
      } catch (error) {
        console.error("Failed to load contacts:", error);
      }
    };

    loadContacts();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const socket = new WebSocket(
      "wss://websocket-chat-server-myo6.onrender.com"
    );

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify({ type: "register", id: user.id }));
    });

    socket.addEventListener("message", async (event) => {
      const msg = JSON.parse(event.data);

      if (msg.from && msg.from !== user.id) {
        const timestamp = Date.now();

        // Save message to IndexedDB
        try {
          await chatStorage.saveMessage({
            from: msg.from,
            to: user.id,
            text: msg.text,
            timestamp,
          });
        } catch (error) {
          console.error("Failed to save incoming message:", error);
        }

        // Save/update contact in IndexedDB
        try {
          await chatStorage.saveContact({
            userId: msg.from,
            lastMessage: msg.text,
            timestamp,
          });
        } catch (error) {
          console.error("Failed to save contact:", error);
        }

        // Fetch user name for the contact
        const userName = await fetchUserName(msg.from);

        // Update or add contact when receiving a message
        setContacts((prev) => {
          const existingIndex = prev.findIndex((c) => c.userId === msg.from);
          const newContact: ChatContact = {
            userId: msg.from,
            userName: userName,
            lastMessage: msg.text,
            timestamp,
          };

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newContact;
            return updated;
          } else {
            return [...prev, newContact];
          }
        });
      }
    });

    return () => {
      socket.close();
    };
  }, [user]);

  if (!user) {
    return <div className="p-4">Please log in to view chats</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recent Conversations</h1>

      {/* Recent chats list */}
      <div>
        {contacts.length === 0 ? (
          <p className="text-gray-500">
            No recent chats. Start a conversation above!
          </p>
        ) : (
          <div className="space-y-2">
            {contacts
              .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
              .map((contact) => (
                <Link
                  key={contact.userId}
                  href={`/chat/${contact.userId}`}
                  className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {contact.userName || `User: ${contact.userId}`}
                      </h3>
                      {contact.lastMessage && (
                        <p className="text-gray-600 text-sm truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                    {contact.timestamp && (
                      <span className="text-xs text-gray-500">
                        {new Date(contact.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
