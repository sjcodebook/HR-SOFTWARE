import { collection, db, getDocs } from './../../scripts/fire'

export function getAllResumes() {
  const resumesRef = collection(db, 'resumes')
  return getDocs(resumesRef)
}
