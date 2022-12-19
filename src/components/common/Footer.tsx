import { makeStyles } from 'tss-react/mui'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

import appStore from '../../store/AppStore'

const useStyles = makeStyles()((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 100,
  },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  appBar: {
    position: 'fixed',
    height: '30px',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 0,
    zIndex: 100,
    justifyContent: 'center',
  },
}))

export default function Footer() {
  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <AppBar
        position='static'
        style={{ backgroundColor: appStore.darkMode ? '#303030' : '#f8f8f8' }}
        className={classes.appBar}>
        <Toolbar style={{ color: appStore.darkMode ? '#fff' : '#808080' }}>
          Copyright &copy; {new Date().getFullYear()} HR SOFTWARE
        </Toolbar>
      </AppBar>
    </div>
  )
}
