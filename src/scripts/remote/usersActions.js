import { collection, doc, db, setDoc } from './../../scripts/fire'

export function editUserName(userId, newName) {
  const usersRef = collection(db, 'users')
  return setDoc(doc(usersRef, userId), { name: newName }, { merge: true })
}
