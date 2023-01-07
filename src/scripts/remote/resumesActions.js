import { collection, db, onSnapshot } from './../../scripts/fire'

export function getAllResumesLive(successCallback, errorCallback) {
  return onSnapshot(collection(db, 'resumes'), successCallback, errorCallback)
}
