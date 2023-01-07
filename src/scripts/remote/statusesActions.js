import dayjs from 'dayjs'

import { collection, db, deleteDoc, doc, addDoc, onSnapshot } from './../../scripts/fire'

export function getAllStatusesLive(successCallback, errorCallback) {
  return onSnapshot(collection(db, 'statuses'), successCallback, errorCallback)
}

export function removeStatus(statusId) {
  return deleteDoc(doc(db, 'statuses', statusId))
}

export function addStatus(statusData) {
  const statusRef = collection(db, 'statuses')
  return addDoc(statusRef, { ...statusData, createdAt: dayjs().unix() })
}
