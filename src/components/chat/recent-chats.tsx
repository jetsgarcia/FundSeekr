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
  unreadCount?: number;
}

export default function RecentChats() {
  const user = useUser();
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>(
    {}
  );

  // Function to clear unread count for a specific contact
  const clearUnreadCount = (userId: string) => {
    setUnreadMessages((prev) => ({
      ...prev,
      [userId]: 0,
    }));

    setContacts((prev) =>
      prev.map((contact) =>
        contact.userId === userId ? { ...contact, unreadCount: 0 } : contact
      )
    );
  };

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
      setIsLoading(true);
      try {
        const storedContacts = await chatStorage.getContacts();
        const contactsWithNames = await Promise.all(
          storedContacts.map(async (contact) => {
            const userName = await fetchUserName(contact.userId);
            const unreadCount = unreadMessages[contact.userId];
            return {
              userId: contact.userId,
              userName: userName,
              lastMessage: contact.lastMessage,
              timestamp: contact.timestamp,
              unreadCount:
                unreadCount && unreadCount > 0 ? unreadCount : undefined,
            };
          })
        );
        setContacts(contactsWithNames);
      } catch (error) {
        console.error("Failed to load contacts:", error);
      } finally {
        setIsLoading(false);
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

        // Increment unread count for this contact and update contacts
        setUnreadMessages((prev) => {
          const newUnreadCount = (prev[msg.from] || 0) + 1;
          const updatedUnreadMessages = {
            ...prev,
            [msg.from]: newUnreadCount,
          };

          // Update or add contact when receiving a message
          setContacts((prevContacts) => {
            const existingIndex = prevContacts.findIndex(
              (c) => c.userId === msg.from
            );
            const newContact: ChatContact = {
              userId: msg.from,
              userName: userName,
              lastMessage: msg.text,
              timestamp,
              unreadCount: newUnreadCount,
            };

            if (existingIndex >= 0) {
              const updated = [...prevContacts];
              updated[existingIndex] = newContact;
              return updated;
            } else {
              return [...prevContacts, newContact];
            }
          });

          return updatedUnreadMessages;
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
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading conversations...</p>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Start building your network! Visit profiles of investors or
              startups you&apos;re interested in and send them a message.
            </p>
            <Link
              href="/home"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Discover People
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {contacts
              .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
              .map((contact) => (
                <Link
                  key={contact.userId}
                  href={`/chat/${contact.userId}`}
                  onClick={() => clearUnreadCount(contact.userId)}
                  className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {contact.userName || `User: ${contact.userId}`}
                        </h3>
                        {contact.unreadCount && contact.unreadCount > 0 && (
                          <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-5">
                            {contact.unreadCount > 99
                              ? "99+"
                              : contact.unreadCount}
                          </div>
                        )}
                      </div>
                      {contact.lastMessage && (
                        <p className="text-gray-600 text-sm truncate">
                          {contact.lastMessage}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {contact.timestamp && (
                        <div className="text-xs text-gray-500 text-right">
                          <div>
                            {new Date(contact.timestamp).toLocaleDateString()}
                          </div>
                          <div>
                            {new Date(contact.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
