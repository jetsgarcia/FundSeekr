interface ChatMessage {
  id?: number;
  conversationId: string; // combination of both user IDs
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

interface ChatContact {
  id?: number;
  userId: string;
  lastMessage?: string;
  timestamp?: number;
}

class ChatStorage {
  private dbName = "FundSeekrChat";
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create messages store
        if (!db.objectStoreNames.contains("messages")) {
          const messagesStore = db.createObjectStore("messages", {
            keyPath: "id",
            autoIncrement: true,
          });
          messagesStore.createIndex("conversationId", "conversationId", {
            unique: false,
          });
          messagesStore.createIndex("timestamp", "timestamp", {
            unique: false,
          });
        }

        // Create contacts store
        if (!db.objectStoreNames.contains("contacts")) {
          const contactsStore = db.createObjectStore("contacts", {
            keyPath: "id",
            autoIncrement: true,
          });
          contactsStore.createIndex("userId", "userId", { unique: true });
        }
      };
    });
  }

  private getConversationId(userId1: string, userId2: string): string {
    return [userId1, userId2].sort().join("_");
  }

  async saveMessage(
    message: Omit<ChatMessage, "id" | "conversationId">
  ): Promise<void> {
    if (!this.db) await this.init();

    const conversationId = this.getConversationId(message.from, message.to);
    const fullMessage: Omit<ChatMessage, "id"> = {
      ...message,
      conversationId,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["messages"], "readwrite");
      const store = transaction.objectStore("messages");
      const request = store.add(fullMessage);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getMessages(
    currentUserId: string,
    otherUserId: string
  ): Promise<ChatMessage[]> {
    if (!this.db) await this.init();

    const conversationId = this.getConversationId(currentUserId, otherUserId);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["messages"], "readonly");
      const store = transaction.objectStore("messages");
      const index = store.index("conversationId");
      const request = index.getAll(conversationId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const messages = request.result.sort(
          (a, b) => a.timestamp - b.timestamp
        );
        resolve(messages);
      };
    });
  }

  async saveContact(contact: Omit<ChatContact, "id">): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["contacts"], "readwrite");
      const store = transaction.objectStore("contacts");
      const index = store.index("userId");

      // Check if contact already exists
      const getRequest = index.get(contact.userId);

      getRequest.onsuccess = () => {
        const existingContact = getRequest.result;

        if (existingContact) {
          // Update existing contact
          const updateRequest = store.put({
            ...existingContact,
            ...contact,
          });
          updateRequest.onerror = () => reject(updateRequest.error);
          updateRequest.onsuccess = () => resolve();
        } else {
          // Add new contact
          const addRequest = store.add(contact);
          addRequest.onerror = () => reject(addRequest.error);
          addRequest.onsuccess = () => resolve();
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getContacts(): Promise<ChatContact[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["contacts"], "readonly");
      const store = transaction.objectStore("contacts");
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const contacts = request.result.sort(
          (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
        );
        resolve(contacts);
      };
    });
  }
}

export const chatStorage = new ChatStorage();
