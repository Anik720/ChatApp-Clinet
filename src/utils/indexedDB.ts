// src/utils/indexedDB.js
import { openDB } from 'idb';

const DB_NAME = 'ChatApp';
const STORE_NAME = 'conversations';

export const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'roomId' });
            }
        }
    });
    return db;
};

export const saveConversations = async (roomId, conversations) => {
    const db = await initDB();
    await db.put(STORE_NAME, { roomId, conversations });
};

export const getConversations = async (roomId) => {
    const db = await initDB();
    return await db.get(STORE_NAME, roomId);
};
