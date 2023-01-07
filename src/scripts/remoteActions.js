import * as dayjs from 'dayjs'

import { onAuthStateChanged, auth, collection, getDoc, doc, db, setDoc } from './../scripts/fire'
import { Constants } from './../scripts/constants'

import userStore from './../store/UserStore'

let unsubscribeListeners = []

export const setAuthStateChangeListener = () => {
  const unsubscribeListenerOnAuth = onAuthStateChanged(auth, (currentUser) => {
    onAuthStateChangedCallback(currentUser)
  })
  unsubscribeListeners.push(unsubscribeListenerOnAuth)
}

const onAuthStateChangedCallback = (currentUser) => {
  if (currentUser) {
    const logoutCallback = logout
    createUserIfNotExists(currentUser, logoutCallback).then((userData) => {
      loadUser(userData)
    })
  }
}

const createUserIfNotExists = async (currentUser, logoutCallback) => {
  try {
    const userRef = doc(db, 'users', currentUser.uid)
    const userSnap = await getDoc(userRef)
    let userData
    if (userSnap.exists()) {
      userData = {
        ...userSnap.data(),
        lastSeen: dayjs().unix(),
      }
    } else {
      userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        picUrl: currentUser.photoURL,
        isAdmin: false,
        isActive: false,
        lastSeen: dayjs().unix(),
        createdAt: dayjs().unix(),
      }
    }
    const usersRef = collection(db, 'users')
    await setDoc(doc(usersRef, currentUser.uid), userData, { merge: true })
    return Promise.resolve(userData)
  } catch (err) {
    console.error(`createUserIfNotExists. Error:\n${err}`)
    logoutCallback().then(() => {
      window.location.href = Constants.jobsConfigs.allPaths.Others.routes.Home.route
    })
  }
}

const loadUser = async (userData) => {
  userStore.setCurrentUser(
    userData.uid,
    userData.email,
    userData.name,
    userData.picUrl,
    userData.lastSeen,
    userData.createdAt,
    userData.isAdmin,
    userData.isActive
  )
}

export const logout = () => {
  return auth
    .signOut()
    .then(() => {
      userStore.resetStore()
      unsubscribeListeners.forEach((unsubscribe) => {
        if (unsubscribe) {
          unsubscribe()
        }
      })
    })
    .catch((err) => {
      console.error(`logout. Error:\n${err}`)
    })
}

export { editUserName, getAllUsers, setActiveStatus, setAdminStatus } from './remote/usersActions'
export { getAllResumes } from './remote/resumesActions'
export { getAllRolesLive, addRole, removeRole } from './remote/rolesActions'
export { getAllStatusesLive, addStatus, removeStatus } from './remote/statusesActions'
