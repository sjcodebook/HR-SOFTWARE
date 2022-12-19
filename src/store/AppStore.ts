import { makeAutoObservable, configure } from 'mobx'
import { createTheme } from '@mui/material/styles'
configure({
  enforceActions: 'never',
})

function AppStore() {
  return makeAutoObservable({
    darkMode: 'light',

    setDarkMode(status: 'dark' | 'light') {
      this.darkMode = status
    },

    get getDarkTheme() {
      const palletType = this.darkMode ? 'dark' : 'light'
      return createTheme({
        palette: {
          mode: palletType,
        },
      })
    },

    resetStore() {
      this.darkMode = 'light'
    },
  })
}

const appStore = new (AppStore as any)()
export default appStore
