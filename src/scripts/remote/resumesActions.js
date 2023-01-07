import { collection, db, onSnapshot, setDoc, doc } from './../../scripts/fire'

export function getAllResumesLive(successCallback, errorCallback) {
  return onSnapshot(collection(db, 'resumes'), successCallback, errorCallback)
}

export function editResumeData(resumeId, newResumeData) {
  const resumesRef = collection(db, 'resumes')
  return setDoc(doc(resumesRef, resumeId), { ...newResumeData }, { merge: true })
}

export function editResumeStatus(resumeId, newStatus) {
  const resumesRef = collection(db, 'resumes')
  return setDoc(doc(resumesRef, resumeId), { status: newStatus }, { merge: true })
}

export function editResumeRole(resumeId, newRole) {
  const resumesRef = collection(db, 'resumes')
  return setDoc(doc(resumesRef, resumeId), { role: newRole }, { merge: true })
}
