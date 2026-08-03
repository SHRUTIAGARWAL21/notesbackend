function isOwner(user, note) {
  return user.id === note.owner_id;
}

module.exports = { isOwner };
