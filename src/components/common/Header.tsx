import { Link, withRouter } from 'react-router-dom'
import { Observer } from 'mobx-react-lite'
import { makeStyles } from 'tss-react/mui'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import NightsStayIcon from '@mui/icons-material/NightsStay'

import MenuDrawer from './MenuDrawer'

import { Constants } from './../../scripts/constants'

import appStore from './../../store/AppStore'
import userStore from './../../store/UserStore'

// import LogoShort from './../../assets/logo-short.png'

const useStyles = makeStyles()((theme) => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 10,
    elevation: 50,
  },
  title: {
    flexGrow: 1,
    color: '#3776f1',
    cursor: 'pointer',
    marginRight: 2,
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}))

function Header(props: any) {
  const { classes } = useStyles()

  return (
    <Observer>
      {() => (
        <div className={classes.root}>
          <AppBar
            position='static'
            style={{ backgroundColor: `${appStore.darkMode ? '#303030' : '#fff'}  ` }}>
            <Toolbar
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <MenuDrawer userStore={userStore} />
                <Avatar
                  alt='HR SOFTWARE'
                  src={'LogoShort'}
                  className={classes.large}
                  variant='square'
                  style={{ marginRight: '0.2em', cursor: 'pointer' }}
                  onClick={() =>
                    props.history.push(Constants.mainConfigs.allPaths.Others.routes.Home.route)
                  }
                />
                <Typography
                  variant='h6'
                  className={classes.title}
                  onClick={() =>
                    props.history.push(Constants.mainConfigs.allPaths.Others.routes.Home.route)
                  }>
                  HR SOFTWARE
                </Typography>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                {userStore.isLoggedIn && (
                  <>
                    {appStore.darkMode ? (
                      <NightsStayIcon
                        style={{ marginRight: 10, marginLeft: 10, cursor: 'pointer' }}
                        fontSize='small'
                        color='secondary'
                        onClick={() => {
                          appStore.setDarkMode(false)
                          localStorage.setItem('darkMode', 'OFF')
                        }}
                      />
                    ) : (
                      <Brightness4Icon
                        style={{ marginRight: 10, marginLeft: 10, cursor: 'pointer' }}
                        fontSize='small'
                        color='primary'
                        onClick={() => {
                          appStore.setDarkMode(true)
                          localStorage.setItem('darkMode', 'ON')
                        }}
                      />
                    )}
                  </>
                )}
                {userStore.isLoggedIn ? (
                  <Avatar
                    alt='User Account'
                    src={userStore.currentUser.picUrl}
                    className={classes.large}
                    style={{ marginRight: '0.5em', cursor: 'pointer' }}
                    onClick={() =>
                      props.history.push(Constants.mainConfigs.allPaths.Others.routes.Profile.route)
                    }
                  />
                ) : (
                  <Link
                    to={Constants.mainConfigs.allPaths.Others.routes.Login.route}
                    style={{
                      textDecoration: 'none',
                    }}>
                    <Button
                      variant='contained'
                      color='primary'
                      size='medium'
                      style={{ marginLeft: '0.5em' }}>
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </Toolbar>
          </AppBar>
        </div>
      )}
    </Observer>
  )
}

export default withRouter(Header)
