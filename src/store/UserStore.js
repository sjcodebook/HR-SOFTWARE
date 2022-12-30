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
      address: null,
      phone: null,
      dob: null,
      picUrl: null,
      lastSeen: null,
      createdAt: null,
      isFirstLogin: null,
    },

    get isLoggedIn() {
      if (this.currentUser.id) {
        return true
      }
      return false
    },

    setCurrentUser(
      id,
      email,
      name,
      address,
      phone,
      dob,
      picUrl,
      lastSeen,
      createdAt,
      isFirstLogin
    ) {
      this.currentUser.id = id
      this.currentUser.email = email
      this.currentUser.name = name
      this.currentUser.address = address
      this.currentUser.phone = phone
      this.currentUser.dob = dob
      this.currentUser.picUrl = picUrl
      this.currentUser.lastSeen = lastSeen
      this.currentUser.createdAt = createdAt
      this.currentUser.isFirstLogin = isFirstLogin
    },

    resetStore() {
      this.currentUser = {
        id: null,
        email: null,
        name: null,
        address: null,
        phone: null,
        dob: null,
        picUrl: null,
        lastSeen: null,
        createdAt: null,
        isFirstLogin: null,
      }
    },
  })
}

const userStore = new UserStore()
export default userStore