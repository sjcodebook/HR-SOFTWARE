export const Constants = {
  defaultPaths: ['Home', 'Timer'],
  mainConfigs: {
    allPaths: {
      Others: {
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
          Admin: {
            id: 'Admin',
            label: 'Home',
            route: '/admin',
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
          ContactInfo: {
            id: 'ContactInfo',
            label: 'Contacts',
            route: '/contact-info',
            selectable: false,
          },
        },
      },
    },
  },
}
