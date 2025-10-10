export const hasRole = (roleList = []) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return false;
  return roleList.includes(user.role);
};

