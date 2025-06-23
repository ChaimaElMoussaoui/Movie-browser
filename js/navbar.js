function Navbar({ currentUser, onLogout }) {
  return (
    <nav>
      <a href="/">Home</a>
      {currentUser ? (
        <>
          <a href="/profile">Profiel</a>
          <button onClick={onLogout}>Uitloggen</button>
        </>
      ) : (
        <a href="/login">Login</a>
      )}
    </nav>
  );
}

export default Navbar;