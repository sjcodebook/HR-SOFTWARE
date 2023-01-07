import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import UsersCard from './Users'
import ResumesCard from './Resumes'

import userStore from './../store/UserStore'
import { showToast } from './../scripts/localActions'
import { getAllUsersLive } from './../scripts/remoteActions'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 20,
  },
}))

const Dashboard = () => {
  const classes = useStyles()
  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const unsubscribeUsersData = getAllUsersLive(
      (snapshot) => {
        setUsers(snapshot.docs.map((doc) => doc.data()).sort((a, b) => b.lastSeen - a.lastSeen))
      },
      (err) => {
        console.log(err)
        showToast('Error Fetching Users', 'error')
      }
    )

    return () => {
      unsubscribeUsersData()
    }
  }, [refresh])

  return (
    <div className={classes.root}>
      <Container fixed>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='h3' align='center' gutterBottom>
              Dashboard
            </Typography>
          </Grid>
          {userStore.currentUser.isAdmin && (
            <Grid item xs={12}>
              <UsersCard users={users} setRefresh={setRefresh} />
            </Grid>
          )}
          <Grid item xs={12}>
            <ResumesCard />
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Dashboard
