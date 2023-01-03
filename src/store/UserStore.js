import { makeAutoObservable, configure } from 'mobx'

configure({
  enforceActions: 'never',
})

function UserStore() {
  return makeAutoObservable({
    currentUser: {
      id: null,
      email: null,
      name: null,
      picUrl: null,
      lastSeen: null,
      createdAt: null,
      isAdmin: null,
      isActive: null,
    },

    get isLoggedIn() {
      if (this.currentUser.id) {
        return true
      }
      return false
    },

    setCurrentUser(id, email, name, picUrl, lastSeen, createdAt, isAdmin, isActive) {
      this.currentUser.id = id
      this.currentUser.email = email
      this.currentUser.name = name
      this.currentUser.picUrl = picUrl
      this.currentUser.lastSeen = lastSeen
      this.currentUser.createdAt = createdAt
      this.currentUser.isAdmin = isAdmin
      this.currentUser.isActive = isActive
    },

    resetStore() {
      this.currentUser = {
        id: null,
        email: null,
        name: null,
        picUrl: null,
        lastSeen: null,
        createdAt: null,
        isAdmin: null,
        isActive: null,
      }
    },
  })
}

const userStore = new UserStore()
export default userStore
