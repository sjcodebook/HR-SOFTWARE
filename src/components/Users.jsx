import React, { useState, Fragment } from 'react'
import * as dayjs from 'dayjs'
import { Scrollbars } from 'react-custom-scrollbars'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import RefreshIcon from '@material-ui/icons/Refresh'

import { showToast } from '../scripts/localActions'
import { setAdminStatus, setActiveStatus } from './../scripts/remoteActions'

import appStore from '../store/AppStore'
import userStore from '../store/UserStore'

export const useStyles = makeStyles((theme) =>
  createStyles({
    rotateIcon: {
      animation: '$spin 1.2s linear infinite',
    },
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(360deg)',
      },
      '100%': {
        transform: 'rotate(0deg)',
      },
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
    Innerpaper: {
      padding: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    rowRoot: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  })
)

const UsersCard = ({ users, setRefresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const classes = useStyles()

  return (
    <Paper className={classes.paper}>
      <Typography variant='h4' color='textPrimary' align='left' gutterBottom>
        All Users{' '}
        <RefreshIcon
          className={isLoading ? classes.rotateIcon : ''}
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setRefresh((prev) => !prev)
            setIsLoading(true)
            setTimeout(() => {
              setIsLoading(false)
            }, 1200)
          }}
        />
      </Typography>
      <Typography variant='body1' color='textSecondary' align='center' gutterBottom>
        Total Results: {users.length}
      </Typography>
      <Paper
        style={{ backgroundColor: appStore.darkMode ? '#303030' : '#fcfcfc' }}
        className={classes.Innerpaper}>
        <TableContainer component={Paper}>
          <Scrollbars style={{ height: 250 }}>
            <Table className={classes.table} size='small' stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>
                    <b>Name</b>
                  </TableCell>
                  <TableCell align='center'>
                    <b>Email</b>
                  </TableCell>
                  <TableCell align='center'>
                    <b>User Type</b>
                  </TableCell>
                  <TableCell align='center'>
                    <b>Last Seen On</b>
                  </TableCell>
                  <TableCell align='center'>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <Row key={user.uid} user={user} setRefresh={setRefresh} />
                ))}
              </TableBody>
            </Table>
          </Scrollbars>
        </TableContainer>
      </Paper>
    </Paper>
  )
}

const Row = ({ user, setRefresh }) => {
  const [isLoading, setIsLoading] = useState(false)
  const classes = useStyles()

  const handleAdminAccess = async (isAdmin) => {
    try {
      setIsLoading(true)
      await setAdminStatus(user.uid, isAdmin)
      setIsLoading(false)
      setRefresh((prev) => !prev)
      showToast('Successfully updated admin status')
    } catch (err) {
      setIsLoading(false)
      showToast('Something went wrong while changing admin status', 'error')
      console.error(err)
    }
  }

  const handleActiveStatus = async (isActive) => {
    try {
      setIsLoading(true)
      await setActiveStatus(user.uid, isActive)
      setIsLoading(false)
      setRefresh((prev) => !prev)
      showToast('Successfully updated active status')
    } catch (err) {
      setIsLoading(false)
      showToast('Something went wrong while changing active status', 'error')
      console.error(err)
    }
  }

  return (
    <Fragment>
      <TableRow className={classes.rowRoot}>
        <TableCell align='center'>{user.name}</TableCell>
        <Tooltip title='Click To Mail' placement='bottom'>
          <TableCell
            align='center'
            style={{ cursor: 'pointer' }}
            onClick={() => window.open(`mailto:${user.email}`)}>
            {user.email}
          </TableCell>
        </Tooltip>
        <TableCell align='center'>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
        <TableCell align='center'>
          {dayjs.unix(user.lastSeen).format('DD/MM/YYYY (HH:mm)')}
        </TableCell>
        <TableCell align='center'>
          <>
            {user.uid === userStore.currentUser.id ? (
              <>N/A</>
            ) : (
              <>
                {user.isAdmin ? (
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    disabled={isLoading}
                    style={{ marginRight: 10 }}
                    onClick={() => handleAdminAccess(false)}>
                    Remove Admin
                  </Button>
                ) : (
                  <Button
                    variant='contained'
                    color='secondary'
                    size='small'
                    disabled={isLoading}
                    style={{ marginRight: 10 }}
                    onClick={() => handleAdminAccess(true)}>
                    Make Admin
                  </Button>
                )}
                {user.isActive ? (
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    disabled={isLoading}
                    style={{ marginRight: 10 }}
                    onClick={() => handleActiveStatus(false)}>
                    Deactivate
                  </Button>
                ) : (
                  <Button
                    variant='contained'
                    color='secondary'
                    size='small'
                    disabled={isLoading}
                    style={{ marginRight: 10 }}
                    onClick={() => handleActiveStatus(true)}>
                    Activate
                  </Button>
                )}
              </>
            )}
          </>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default UsersCard
