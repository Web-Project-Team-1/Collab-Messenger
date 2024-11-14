import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db} from '../config/firebase.config';

export const getUserByHandle = async (handle) => {
    const snapshot = await get(ref(db, `users/${handle}`));
    return snapshot.val();
};

export const createUserHandle = async (handle, uid, email, isAdmin = false) => {
    if (!handle || !uid || !email) {
        throw new Error("Invalid parameters for createUserHandle: handle, uid, and email are required.");
    }

    const user = {
        uid,
        email,
        handle,
        isAdmin,
        createdOn: new Date().toISOString()
    };

    await set(ref(db, `users/${handle}`), user);
};

export const getUserData = async (uid) => {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
    const data = snapshot.val();

    if (data) {
        const userIdKey = Object.keys(data)[0];
        const userData = data[userIdKey];
        
        return {
            ...userData,
            photoURL: userData.photoURL || null,
        };
    }
    
    return null;
};