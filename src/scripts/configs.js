import { GoogleAuthProvider, EmailAuthProvider } from 'firebase/auth'

// import userStore from './../store/UserStore'

import { Constants } from './../scripts/constants'

const Configs = {
  Production: {
    Env: 'Production',
    FirebaseConfig: {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
    },
    FirebaseFunctionUrl: '/api',
    uiConfig: {
      signInFlow: 'redirect',
      signInSuccessUrl: Constants.mainConfigs.allPaths.routes.Login.route,
      signInOptions: [
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
        EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        // signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        //   if (authResult.user) {
        //     const currentUser = authResult.user
        //     userStore.setCurrentUser(currentUser.uid, currentUser.email, currentUser.displayName, currentUser.picURL)
        //   }
        // },
      },
    },
  },
  Staging: {
    Env: 'Staging',
    FirebaseConfig: {
      apiKey: process.env.REACT_APP_DEV_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_DEV_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_DEV_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_DEV_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_DEV_FIREBASE_MESSAGE_SENDER_ID,
      appId: process.env.REACT_APP_DEV_FIREBASE_APP_ID,
    },
    FirebaseFunctionUrl: '/api',
    uiConfig: {
      signInFlow: 'redirect',
      signInSuccessUrl: Constants.mainConfigs.allPaths.routes.Login.route,
      signInOptions: [
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
        EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        // signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        //   if (authResult.user) {
        //     const currentUser = authResult.user
        //     userStore.setCurrentUser(currentUser.uid, currentUser.email, currentUser.displayName, currentUser.picURL)
        //   }
        // },
      },
    },
  },
  Local: {
    Env: 'Local',
    FirebaseConfig: {
      apiKey: process.env.REACT_APP_DEV_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_DEV_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_DEV_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_DEV_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_DEV_FIREBASE_MESSAGE_SENDER_ID,
      appId: process.env.REACT_APP_DEV_FIREBASE_APP_ID,
    },
    FirebaseFunctionUrl: 'http://localhost:5001/hr-software-33bf5/us-central1',
    uiConfig: {
      signInFlow: 'redirect',
      signInSuccessUrl: Constants.mainConfigs.allPaths.routes.Login.route,
      signInOptions: [
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
        EmailAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        // signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        //   if (authResult.user) {
        //     const currentUser = authResult.user
        //     userStore.setCurrentUser(currentUser.uid, currentUser.email, currentUser.displayName, currentUser.picURL)
        //   }
        // },
      },
    },
  },
}

let Config
if (process.env.NODE_ENV === 'development') {
  Config = Configs.Local
  console.log(Config.Env + ' Environment')
} else if (window.location.hostname === 'crm.x.com' && process.env.NODE_ENV === 'production') {
  Config = Configs.Production
  // Do not console.log
} else {
  Config = Configs.Staging
  console.log(Config.Env + ' Environment')
}

export default Config
