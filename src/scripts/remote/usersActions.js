import { collection, doc, db, setDoc, onSnapshot } from './../../scripts/fire'

export function getAllUsersLive(successCallback, errorCallback) {
  return onSnapshot(collection(db, 'users'), successCallback, errorCallback)
}

export function editUserName(userId, newName) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { name: newName }, { merge: true })
}

export function setAdminStatus(userId, isAdmin) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { isAdmin }, { merge: true })
}

export function setActiveStatus(userId, isActive) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { isActive }, { merge: true })
}
