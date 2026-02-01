export function getUserKey() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  return user.email || "guest";
}
