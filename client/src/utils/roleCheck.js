export const hasRole = (allowedRoles = []) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return false;
  return allowedRoles.includes(user.role);
};
