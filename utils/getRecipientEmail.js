export function getRecipientEmail(users, userLoggedIn){
  const recipientEmailArray = Object.values(users).filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];
  const recipientEmailValue = recipientEmailArray.filter((valuesToFilter) => valuesToFilter !== userLoggedIn?.email);
  const recipientEmail = recipientEmailValue[0];
  return recipientEmail;
}

export function getRecipientEmailLite(users, userLoggedIn) {
  const recipientEmail = Object.values(users).filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];
  return recipientEmail;
}
