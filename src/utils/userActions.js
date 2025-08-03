export const setUser = (user) => {  localStorage.setItem('squidUser', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('squidUser');
  return JSON.parse(user || `{}`);
};
