import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import "../auth/firebase-auth.js"; 

const db = getFirestore();
const auth = getAuth();

export async function getUserFavorites(userId) {
  if (!userId) return [];
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    return userDoc.data().favorites || [];
  }
  return [];
}

export async function addUserFavorite(movieId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Niet ingelogd!");
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { favorites: arrayUnion(movieId) });
}