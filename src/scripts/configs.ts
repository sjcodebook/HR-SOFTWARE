import firebase from 'firebase'
// import userStore from './../store/UserStore'

import { Constants } from './../scripts/constants'

const Configs = {
  Production: {
    Env: 'Production',
    FirebaseConfig: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    },
    FirebaseFunctionUrl: '/api',
    uiConfig: {
      signInFlow: 'redirect',
      signInSuccessUrl: Constants.mainConfigs.allPaths.Others.routes.Login.route,
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
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
      apiKey: import.meta.env.VITE_DEV_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_DEV_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_DEV_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_DEV_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_DEV_FIREBASE_MESSAGE_SENDER_ID,
      appId: import.meta.env.VITE_DEV_FIREBASE_APP_ID,
    },
    FirebaseFunctionUrl: '/api',
    uiConfig: {
      signInFlow: 'redirect',
      signInSuccessUrl: Constants.mainConfigs.allPaths.Others.routes.Login.route,
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
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
      apiKey: import.meta.env.VITE_DEV_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_DEV_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_DEV_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_DEV_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_DEV_FIREBASE_MESSAGE_SENDER_ID,
      appId: import.meta.env.VITE_DEV_FIREBASE_APP_ID,
    },
    FirebaseFunctionUrl: 'http://localhost:5001/hr-software-33bf5/us-central1',
    uiConfig: {
      signInFlow: 'redirect',
      signInSuccessUrl: Constants.mainConfigs.allPaths.Others.routes.Login.route,
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account',
          },
        },
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
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

let Config: typeof Configs.Local | typeof Configs.Staging | typeof Configs.Production
if (import.meta.env.NODE_ENV === 'development') {
  Config = Configs.Local as typeof Configs.Local
  console.log(Config.Env + ' Environment')
} else if (window.location.hostname === 'crm.x.com' && import.meta.env.NODE_ENV === 'production') {
  Config = Configs.Production
  // Do not console.log
} else {
  Config = Configs.Staging
  console.log(Config.Env + ' Environment')
}

export default Config
