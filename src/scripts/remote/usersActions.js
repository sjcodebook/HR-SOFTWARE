import { collection, doc, db, setDoc, getDocs } from './../../scripts/fire'

export function editUserName(userId, newName) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { name: newName }, { merge: true })
}

export function getAllUsers() {
  const usersRef = collection(db, 'users')
  return getDocs(usersRef)
}

export function setAdminStatus(userId, isAdmin) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { isAdmin }, { merge: true })
}

export function setActiveStatus(userId, isActive) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { isActive }, { merge: true })
}
