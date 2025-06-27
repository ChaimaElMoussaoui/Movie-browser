import { auth, db } from '../auth/firebase-auth.js';
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { doc, getDoc, updateDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getUserFavorites } from './favorites.js';

let currentUser = null;

// Wacht tot gebruiker is ingelogd
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Ingelogd als:", user.email);
    currentUser = user;
    updateNavbar(user);
    await loadUserProfile(user);
  } else {
    // Niet ingelogd - doorsturen naar login
    alert('Je moet ingelogd zijn om je profiel te bekijken!');
    window.location.href = '/views/login.html';
  }
});

// Update navbar
function updateNavbar(user) {
  const profileArea = document.getElementById('profileArea');
  const loginLink = document.getElementById('login-link');
  
  if (user) {
    if (profileArea) {
      profileArea.innerHTML = `
        <a href="/views/profile.html">
          <img src="${user.photoURL || '/assets/default.png'}" alt="Profile" class="profile-pic">
        </a>
      `;
    }
    if (loginLink) loginLink.style.display = "none";
  } else {
    if (profileArea) profileArea.innerHTML = "";
    if (loginLink) loginLink.style.display = "";
  }
}

async function loadUserProfile(user) {
  try {
    // Haal gebruiker data op uit Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    // Haal favorieten op
    const favorites = await getUserFavorites(user.uid);
    
    // Update de profiel UI
    updateProfileUI(user, userData, favorites);
    
  } catch (error) {
    console.error('Fout bij laden profiel:', error);
    document.getElementById('profile-content').innerHTML = '<p>Fout bij laden van profiel.</p>';
  }
}

function updateProfileUI(user, userData, favorites) {
  const profileContent = document.getElementById('profile-content');
  
  // Bepaal account aanmaak datum
  const createdAt = userData.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Onbekend';
  
  profileContent.innerHTML = `
    <div class="profile-header">
      <div class="profile-picture-section">
        <img src="${user.photoURL || '/assets/default.png'}" alt="Profile Picture" class="large-profile-pic" id="profilePicture">
        <button class="change-photo-btn" id="changePhotoBtn">
          <span class="material-icons">camera_alt</span>
          Foto wijzigen
        </button>
        <input type="file" id="photoInput" accept="image/*" style="display: none;">
      </div>
      
      <div class="profile-info">
        <h1>${userData.username || 'Gebruiker'}</h1>
        <p class="email">${user.email}</p>
        <p class="join-date">Lid sinds: ${createdAt}</p>
        <p class="favorites-count">${favorites.length} favorieten</p>
      </div>
    </div>
    
    <div class="profile-stats">
      <div class="stat-card">
        <h3>${favorites.length}</h3>
        <p>Favorieten</p>
      </div>
      <div class="stat-card">
        <h3>${userData.reviews?.length || 0}</h3>
        <p>Reviews</p>
      </div>
      <div class="stat-card">
        <h3>${userData.watchlist?.length || 0}</h3>
        <p>Watchlist</p>
      </div>
    </div>
    
    <div class="profile-sections">
      <div class="profile-section">
        <h2>Account Instellingen</h2>
        <div class="setting-item">
          <label for="usernameInput">Gebruikersnaam:</label>
          <div class="input-group">
            <input type="text" id="usernameInput" value="${userData.username || ''}" placeholder="Voer je gebruikersnaam in">
            <button class="save-btn" id="saveUsernameBtn">Opslaan</button>
          </div>
        </div>
        <div class="setting-item">
          <button class="logout-btn" id="logoutBtn">
            <span class="material-icons">logout</span>
            Uitloggen
          </button>
        </div>
      </div>
      
      <div class="profile-section">
        <h2>Recent Toegevoegde Favorieten</h2>
        <div class="recent-favorites" id="recentFavorites">
          ${favorites.slice(0, 6).map(fav => `
            <div class="mini-movie-card">
              <img src="https://image.tmdb.org/t/p/w200${fav.poster_path}" alt="${fav.title}">
              <span>${fav.title}</span>
            </div>
          `).join('')}
        </div>
        ${favorites.length > 6 ? `<a href="/views/favorites.html" class="view-all-btn">Bekijk alle favorieten</a>` : ''}
      </div>
    </div>
  `;
  
  // Setup event listeners
  setupProfileEventListeners();
}

function setupProfileEventListeners() {
  // Photo change functionality
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const photoInput = document.getElementById('photoInput');
  const profilePicture = document.getElementById('profilePicture');
  
  if (changePhotoBtn && photoInput) {
    changePhotoBtn.addEventListener('click', () => {
      photoInput.click();
    });
    
    photoInput.addEventListener('change', handlePhotoChange);
  }
  
  // Username save functionality
  const saveUsernameBtn = document.getElementById('saveUsernameBtn');
  if (saveUsernameBtn) {
    saveUsernameBtn.addEventListener('click', handleUsernameSave);
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js");
        await signOut(auth);
        window.location.href = '/views/index.html';
      } catch (error) {
        console.error('Error logging out:', error);
        alert('Er ging iets fout bij het uitloggen.');
      }
    });
  }
}

async function handlePhotoChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Valideer bestand
  if (!file.type.startsWith('image/')) {
    alert('Selecteer een geldige afbeelding.');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    alert('Bestand is te groot. Maximaal 5MB toegestaan.');
    return;
  }
  
  try {
    // Convert to base64 for simple storage (in production, use proper file storage)
    const reader = new FileReader();
    reader.onload = async (e) => {
      const photoURL = e.target.result;
      
      // Update Firebase Auth profile
      await updateProfile(currentUser, { photoURL });
      
      // Update Firestore document
      await updateDoc(doc(db, "users", currentUser.uid), {
        photoURL: photoURL
      });
      
      // Update UI
      document.getElementById('profilePicture').src = photoURL;
      
      // Update navbar
      const navProfilePic = document.querySelector('.profile-pic');
      if (navProfilePic) {
        navProfilePic.src = photoURL;
      }
      
      alert('Profielfoto succesvol bijgewerkt!');
    };
    
    reader.readAsDataURL(file);
    
  } catch (error) {
    console.error('Fout bij updaten profielfoto:', error);
    alert('Er ging iets fout bij het bijwerken van je profielfoto.');
  }
}

async function handleUsernameSave() {
  const usernameInput = document.getElementById('usernameInput');
  const newUsername = usernameInput.value.trim();
  
  if (!newUsername) {
    alert('Gebruikersnaam mag niet leeg zijn.');
    return;
  }
  
  if (newUsername.length < 3) {
    alert('Gebruikersnaam moet minimaal 3 karakters lang zijn.');
    return;
  }
  
  try {
    // Update Firestore document
    const userRef = doc(db, "users", currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        username: newUsername
      });
    } else {
      await setDoc(userRef, {
        username: newUsername,
        email: currentUser.email,
        createdAt: new Date().toISOString()
      });
    }
    
    alert('Gebruikersnaam succesvol bijgewerkt!');
    
  } catch (error) {
    console.error('Fout bij updaten gebruikersnaam:', error);
    alert('Er ging iets fout bij het bijwerken van je gebruikersnaam.');
  }
}

// Dark mode functionality
document.addEventListener("DOMContentLoaded", () => {
  const darkModeButton = document.getElementById("toggle-dark");
  const darkModeIcon = document.getElementById("dark-mode-icon");
  let isDarkMode = true;

  if (darkModeButton && darkModeIcon) {
    darkModeButton.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle("light-mode", !isDarkMode);

      if (isDarkMode) {
        darkModeIcon.textContent = "dark_mode"; 
      } else {
        darkModeIcon.textContent = "light_mode";
      }
    });
  }
});
