function isOwner(user, note) {
  return user.id === note.owner_id;
}

function isAdmin(user) {
  return user.role === "admin";
}

function canManage(user, note) {
  return isOwner(user, note) || isAdmin(user);
}

function canView(user, note, share) {
  return canManage(user, note) || note.visibility === "public" || !!share;
}

function canEdit(user, note, share) {
  return canManage(user, note) || (share && share.permission === "editor");
}

module.exports = { isOwner, isAdmin, canManage, canView, canEdit };
