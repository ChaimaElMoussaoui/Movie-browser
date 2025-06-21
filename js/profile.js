

// Importeer Firebase modules vanuit je bestaande CDN (let op: geen node imports!)
import { getAuth, updateProfile, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-storage.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { app } from "/auth/firebase-auth.js"; // Zorg dat je app exported in firebase-auth.js!

const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// === PROFIEL FOTO UPLOAD ===
const avatarInput = document.getElementById("profilePicInput");
const avatarImg = document.getElementById("profilePic");
avatarInput?.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const user = auth.currentUser;
  if (!user) return alert("Niet ingelogd!");

  // Upload naar Firebase Storage
  const storageRef = ref(storage, `profilePics/${user.uid}/avatar.jpg`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Update Auth profiel (photoURL)
  await updateProfile(user, { photoURL: url });

  // Update ook je Firestore profiel data als je daar een photoURL veld wilt gebruiken:
  const userRef = doc(db, "users", user.uid);
  await updateDoc(userRef, { photoURL: url });

  // Toon direct op pagina
  avatarImg.src = url;
});

// === NAAM WIJZIGEN ===
const saveBtn = document.querySelector(".save-profile");
const nameEl = document.getElementById("profileNaam");
saveBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;
  const newName = nameEl.value.trim();
  if (newName && newName !== user.displayName) {
    await updateProfile(user, { displayName: newName });
    // Ook in Firestore bijwerken
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { username: newName });
    alert("Naam bijgewerkt!");
  }
});

// === EMAIL VERIFICATIE ===
document.addEventListener("click", function(e) {
  if (e.target && e.target.id === "resendVerification") {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      sendEmailVerification(user).then(() => {
        alert("Verificatie-email verstuurd!");
      });
    }
  }
});