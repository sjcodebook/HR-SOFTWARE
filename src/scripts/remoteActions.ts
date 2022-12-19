// @ts-nocheck

import * as dayjs from 'dayjs'

import { firestore, auth } from './../scripts/fire'
import { Constants } from './../scripts/constants'

import userStore from './../store/UserStore'

let unsubscribeListeners = []

export const setAuthStateChangeListener = () => {
  const unsubscribeListenerOnAuth = auth.onAuthStateChanged((currentUser) => {
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
    const docData = await firestore.collection('users').doc(currentUser.uid).get()
    let userData
    if (docData.exists) {
      userData = {
        ...docData.data(),
        lastSeen: dayjs().unix(),
      }
    } else {
      userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        name: currentUser.displayName,
        address: '',
        phone: '',
        dob: '',
        job: '',
        salary: '',
        picUrl: currentUser.photoURL,
        isAdmin: false,
        isActive: true,
        lastSeen: dayjs().unix(),
        createdAt: dayjs().unix(),
        emergencyContactName: '',
        emergencyContactNumber: '',
        isFirstLogin: true,
      }
    }
    await firestore.collection('users').doc(currentUser.uid).set(userData, { merge: true })
    return Promise.resolve(userData)
  } catch (err) {
    console.error(`createUserIfNotExists. Error:\n${err}`)
    logoutCallback().then(() => {
      window.location.href = Constants.jobsConfigs.allPaths.Others.routes.Home.route
    })
  }
}

const loadUser = async (userData) => {
  let jobConfig = await getJobById(userData?.job || 'notAvailable')
  jobConfig = jobConfig.exists
    ? { ...jobConfig.data(), id: jobConfig.id }
    : {
        label: '',
        paths: [],
        cards: [],
        actions: [],
        defaultPath: 'Home',
      }
  userStore.setCurrentUser(
    userData.uid,
    userData.email,
    userData.name,
    userData.address,
    userData.phone,
    userData.dob,
    jobConfig,
    userData.jobApproved,
    userData.salary,
    userData.picUrl,
    userData.isAdmin,
    userData.lastSeen,
    userData.createdAt,
    userData.emergencyContactName,
    userData.emergencyContactNumber,
    userData.isFirstLogin
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
