const SECRET = "my_secret_key_123";

export const getAuth = () => {
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  const email = user.email || "guest";

  const token = btoa(email + SECRET);

  return { email, token };
};