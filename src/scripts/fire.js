import Configs from './configs'

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const config = Configs.FirebaseConfig
const app = initializeApp(config)

const auth = getAuth(app)
const db = getFirestore(app)
export { auth, db }
export { onAuthStateChanged } from 'firebase/auth'
export { getDoc, getDocs, setDoc, doc, collection } from 'firebase/firestore'
