import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { createUserHandle } from './users.service';


export const registerUser = async (email, password, handle) => {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserHandle(handle, user.uid, email, false);

    return userCredential;
};