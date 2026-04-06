(() => {
  "use strict";

  const KEYS = {
    users: "travelSiteUsers",
    currentUser: "loggedInUser"
  };

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeUsers(users) {
    if (!Array.isArray(users)) {
      return [];
    }

    return users
      .filter(user => user && user.email && user.password)
      .map(user => ({
        name: user.name ? String(user.name).trim() : "Traveler",
        email: String(user.email).trim().toLowerCase(),
        password: String(user.password)
      }));
  }

  function migrateLegacyStorage() {
    const legacyCollections = [
      readJSON(KEYS.users, []),
      readJSON("users", []),
      readJSON("travelUsers", [])
    ];

    const singleLegacyUser = readJSON("user", null);
    if (singleLegacyUser) {
      legacyCollections.push([singleLegacyUser]);
    }

    const mergedUsers = [];
    const seenEmails = new Set();

    legacyCollections.flat().forEach(user => {
      const normalized = normalizeUsers([user])[0];
      if (!normalized || seenEmails.has(normalized.email)) {
        return;
      }

      seenEmails.add(normalized.email);
      mergedUsers.push(normalized);
    });

    writeJSON(KEYS.users, mergedUsers);

    const currentUser =
      readJSON(KEYS.currentUser, null) ||
      readJSON("currentUser", null) ||
      readJSON("user", null);

    if (currentUser && currentUser.email) {
      const normalizedCurrentUser = normalizeUsers([currentUser])[0];
      if (normalizedCurrentUser) {
        writeJSON(KEYS.currentUser, normalizedCurrentUser);
      }
    }

    if (localStorage.getItem("isLoggedIn") === "true" && !localStorage.getItem(KEYS.currentUser)) {
      const firstUser = mergedUsers[0] || null;
      if (firstUser) {
        writeJSON(KEYS.currentUser, firstUser);
      }
    }

    localStorage.removeItem("users");
    localStorage.removeItem("travelUsers");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
  }

  function getUsers() {
    return normalizeUsers(readJSON(KEYS.users, []));
  }

  function saveUsers(users) {
    writeJSON(KEYS.users, normalizeUsers(users));
  }

  function getCurrentUser() {
    const user = readJSON(KEYS.currentUser, null);
    return user && user.email ? normalizeUsers([user])[0] : null;
  }

  function setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(KEYS.currentUser);
      return;
    }

    writeJSON(KEYS.currentUser, normalizeUsers([user])[0]);
  }

  function signup({ name, email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim();
    const normalizedPassword = String(password || "");

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return { ok: false, message: "All fields are required." };
    }

    const users = getUsers();
    if (users.some(user => user.email === normalizedEmail)) {
      return { ok: false, message: "An account with this email already exists." };
    }

    const newUser = {
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword
    };

    users.push(newUser);
    saveUsers(users);

    return { ok: true, user: newUser };
  }

  function login({ email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    const user = getUsers().find(
      savedUser => savedUser.email === normalizedEmail && savedUser.password === normalizedPassword
    );

    if (!user) {
      return { ok: false, message: "Invalid email or password." };
    }

    setCurrentUser(user);
    return { ok: true, user };
  }

  function logout() {
    setCurrentUser(null);
  }

  migrateLegacyStorage();

  window.travelAuth = {
    getUsers,
    getCurrentUser,
    isLoggedIn() {
      return !!getCurrentUser();
    },
    signup,
    login,
    logout
  };
})();
