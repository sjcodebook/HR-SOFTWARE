import { makeAutoObservable, configure } from 'mobx'

configure({
  enforceActions: 'never',
})

interface User {
  id: string | null
  email: string | null
  name: string | null
  address: string | null
  phone: string | null
  dob: string | null
  jobConfig: string | null
  jobApproved: boolean
  salary: string | null
  picUrl: string | null
  isAdmin: boolean
  lastSeen: string | null
  createdAt: string | null
  emergencyContactName: string | null
  emergencyContactNumber: string | null
  isFirstLogin: boolean
}

function UserStore() {
  return makeAutoObservable({
    currentUser: {
      id: null,
      email: null,
      name: null,
      address: null,
      phone: null,
      dob: null,
      jobConfig: null,
      jobApproved: false,
      salary: null,
      picUrl: null,
      isAdmin: false,
      lastSeen: null,
      createdAt: null,
      emergencyContactName: null,
      emergencyContactNumber: null,
      isFirstLogin: null,
    } as unknown as User,

    get isLoggedIn() {
      if (this.currentUser.id) {
        return true
      }
      return false
    },

    get hasOthersContentAccess() {
      if (this.currentUser.isAdmin) {
        return true
      }
      return false
    },

    setCurrentUser({
      id,
      email,
      name,
      address,
      phone,
      dob,
      jobConfig,
      jobApproved,
      salary,
      picUrl,
      isAdmin,
      lastSeen,
      createdAt,
      emergencyContactName,
      emergencyContactNumber,
      isFirstLogin,
    }: User) {
      this.currentUser.id = id
      this.currentUser.email = email
      this.currentUser.name = name
      this.currentUser.address = address
      this.currentUser.phone = phone
      this.currentUser.dob = dob
      this.currentUser.jobConfig = jobConfig
      this.currentUser.jobApproved = jobApproved
      this.currentUser.salary = salary
      this.currentUser.picUrl = picUrl
      this.currentUser.isAdmin = isAdmin
      this.currentUser.lastSeen = lastSeen
      this.currentUser.createdAt = createdAt
      this.currentUser.emergencyContactName = emergencyContactName
      this.currentUser.emergencyContactNumber = emergencyContactNumber
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
        jobConfig: null,
        jobApproved: false,
        salary: null,
        picUrl: null,
        isAdmin: false,
        lastSeen: null,
        createdAt: null,
        emergencyContactName: null,
        emergencyContactNumber: null,
        isFirstLogin: false,
      }
    },
  })
}

const userStore = new (UserStore as any)()
export default userStore
