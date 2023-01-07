import dayjs from 'dayjs'

import { collection, db, deleteDoc, doc, addDoc, onSnapshot } from './../../scripts/fire'

export function getAllRolesLive(successCallback, errorCallback) {
  return onSnapshot(collection(db, 'roles'), successCallback, errorCallback)
}

export function removeRole(roleId) {
  return deleteDoc(doc(db, 'roles', roleId))
}

export function addRole(roleData) {
  console.log('addRole', roleData)
  const rolesRef = collection(db, 'roles')
  return addDoc(rolesRef, { ...roleData, createdAt: dayjs().unix() })
}
