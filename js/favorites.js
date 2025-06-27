import { auth, db } from '../auth/firebase-auth.js';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Functie om een film toe te voegen aan favorieten
export async function addUserFavorite(movieId, movieData = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Niet ingelogd!");
  
  const userRef = doc(db, "users", user.uid);
  
  try {
    // Eerst checken of gebruiker document bestaat
    const userDoc = await getDoc(userRef);
    
    const favoriteItem = {
      id: movieId,
      title: movieData.title || movieData.name || 'Onbekende titel',
      poster_path: movieData.poster_path || null,
      addedAt: new Date().toISOString()
    };
    
    if (!userDoc.exists()) {
      // Maak nieuw gebruiker document aan
      await setDoc(userRef, {
        favorites: [favoriteItem],
        email: user.email,
        createdAt: new Date().toISOString()
      });
    } else {
      // Check of favoriet al bestaat
      const currentFavorites = userDoc.data().favorites || [];
      const alreadyExists = currentFavorites.some(fav => fav.id === movieId);
      
      if (!alreadyExists) {
        await updateDoc(userRef, {
          favorites: arrayUnion(favoriteItem)
        });
      }
    }
    
    console.log("Film toegevoegd aan favorieten:", movieId);
  } catch (error) {
    console.error("Fout bij toevoegen favoriet:", error);
    throw error;
  }
}

// Functie om een film te verwijderen uit favorieten
export async function removeUserFavorite(movieId) {
  const user = auth.currentUser;
  if (!user) throw new Error("Niet ingelogd!");
  
  const userRef = doc(db, "users", user.uid);
  
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const currentFavorites = userDoc.data().favorites || [];
      const favoriteToRemove = currentFavorites.find(fav => fav.id === movieId);
      
      if (favoriteToRemove) {
        await updateDoc(userRef, {
          favorites: arrayRemove(favoriteToRemove)
        });
        console.log("Film verwijderd uit favorieten:", movieId);
      }
    }
  } catch (error) {
    console.error("Fout bij verwijderen favoriet:", error);
    throw error;
  }
}

// Functie om alle favorieten van een gebruiker op te halen
export async function getUserFavorites(userId) {
  if (!userId) return [];
  
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data().favorites || [];
    }
    return [];
  } catch (error) {
    console.error("Fout bij ophalen favorieten:", error);
    return [];
  }
}

// Functie om te checken of een film een favoriet is
export async function isMovieFavorite(movieId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const favorites = await getUserFavorites(user.uid);
    return favorites.some(fav => fav.id === movieId);
  } catch (error) {
    console.error("Fout bij checken favoriet:", error);
    return false;
  }
}
