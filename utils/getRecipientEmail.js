const getRecipientEmail = (users, userLoggedIn) =>
  Object.values(users).filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];
export default getRecipientEmail;
