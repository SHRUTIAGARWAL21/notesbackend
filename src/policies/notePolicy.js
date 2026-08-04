function isOwner(user, note) {
  return user.id === note.owner_id;
}

function canView(user, note, share) {
  return isOwner(user, note) || note.visibility === "public" || !!share;
}

function canEdit(user, note, share) {
  return isOwner(user, note) || (share && share.permission === "editor");
}

module.exports = { isOwner, canView, canEdit };
