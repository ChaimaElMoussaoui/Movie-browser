# Movie Browser

Movie Browser is een webapplicatie waarmee je films kunt ontdekken, zoeken en je favorieten kunt beheren. Het project gebruikt [Firebase](https://firebase.google.com/) voor authenticatie en data-opslag en is gebouwd met JavaScript, HTML en CSS.

## Functies

- Registratie en inloggen met Firebase Authentication
- Films zoeken en ontdekken
- Films toevoegen aan persoonlijke favorieten
- Responsieve en moderne gebruikersinterface
- Beheer van gebruikersprofielen
- Uitloggen

## Gebruikte technologieën

- **JavaScript** (voor de applicatielogica)
- **HTML/CSS** (voor de UI en layout)
- **Firebase** (Authentication & Firestore database)

## Snel starten

### 1. Repository klonen

```bash
git clone https://github.com/ChaimaElMoussaoui/Movie-browser.git
cd Movie-browser
```

### 2. Firebase Instellen

1. Ga naar de [Firebase Console](https://console.firebase.google.com/), maak een nieuw project aan en activeer **Authentication** (E-mail/Wachtwoord).
2. Maak een **Firestore Database** aan.
3. Plak je Firebase-configuratie in de Firebase initialisatiecode van het project (meestal in `firebase-auth.js`).

### 3. Lokaal draaien

Je kunt `index.html` direct openen in je browser, of gebruik een lokale server zoals [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) voor het beste resultaat.

### 4. Omgevingsvariabelen

Bewaar je Firebase API keys veilig en stel ze niet bloot in een publieke repository voor productie.

