export const Constants = {
  defaultPaths: ['Home', 'Timer'],
  mainConfigs: {
    allPaths: {
      id: 'Others',
      label: 'Others',
      selectable: true,
      routes: {
        Home: {
          id: 'Home',
          label: 'Home',
          route: '/',
          selectable: false,
        },
        Login: {
          id: 'Login',
          label: 'Login',
          route: '/login',
          selectable: false,
        },
        Profile: {
          id: 'Profile',
          label: 'My Profile',
          route: '/profile',
          selectable: false,
        },
      },
    },
  },
}
