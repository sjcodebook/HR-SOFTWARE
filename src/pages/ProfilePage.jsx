import React, { useState, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import ClearIcon from '@material-ui/icons/Clear'

import AuthChecker from './../components/common/AuthChecker'

import userStore from '../store/UserStore'

import { showToast } from './../scripts/localActions'
import { logout } from './../scripts/remoteActions'
import { editUserName } from '../scripts/remote/usersActions'

const EditScreen = ({ userStore, firstLogin, setVisiblity }) => {
  const [newName, setNewName] = useState(userStore.currentUser.name)
  const [canSubmit, setCanSubmit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!newName?.trim() || newName?.trim() === userStore.currentUser.name) {
      setCanSubmit(false)
    } else {
      setCanSubmit(true)
    }
  }, [newName, userStore.currentUser.name])

  const handleSubmit = () => {
    setIsLoading(true)
    editUserName(userStore.currentUser.id, newName?.trim())
      .then((res) => {
        showToast('User Info Updated Successfully.')
        window.location.reload()
      })
      .catch((err) => {
        setIsLoading(false)
        showToast('Something Went wrong updating user.', 'error')
        console.error('handleSubmit:UserNameUpdate\n', err)
      })
  }

  return (
    <Observer>
      {() => (
        <Grid
          container
          direction='column'
          alignItems='center'
          justifyContent='center'
          style={{ minHeight: '80vh' }}>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <h2>Edit Saved Information</h2>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ minWidth: 290, textAlign: 'center', padding: '20px' }}>
              <CardContent>
                <Grid container spacing={4}>
                  {!firstLogin && (
                    <Grid item xs={12}>
                      <div style={{ textAlign: 'right' }}>
                        <ClearIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => setVisiblity(false)}
                        />
                      </div>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <TextField
                      value={newName}
                      label='Name'
                      variant='outlined'
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      disabled={true}
                      type='email'
                      value={userStore.currentUser.email}
                      label='Email'
                      variant='outlined'
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <br />
              <Button
                disabled={!canSubmit || isLoading}
                variant='contained'
                color='primary'
                onClick={() => handleSubmit()}>
                Submit
              </Button>
            </Card>
          </Grid>
          <br />
          <Grid item xs={12}>
            <Button variant='contained' color='secondary' onClick={logout}>
              Logout
            </Button>
          </Grid>
        </Grid>
      )}
    </Observer>
  )
}

const ProfilePage = () => {
  const [showEditScreen, setShowEditScreen] = useState(false)

  if (showEditScreen) {
    return (
      <Observer>
        {() => (
          <AuthChecker
            children={<EditScreen userStore={userStore} setVisiblity={setShowEditScreen} />}
          />
        )}
      </Observer>
    )
  }

  return (
    <Observer>
      {() => (
        <AuthChecker
          children={
            <Grid
              container
              spacing={0}
              direction='column'
              alignItems='center'
              justifyContent='center'
              style={{ marginTop: '40px' }}>
              <Grid item xs={12}>
                <Avatar
                  alt='User Account'
                  src={userStore.currentUser.picUrl}
                  style={{
                    width: '100px',
                    height: '100px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                />
              </Grid>
              <br />
              <Grid item xs={12}>
                <Card style={{ minWidth: 290, textAlign: 'center', padding: '15px' }}>
                  <CardContent>
                    <div style={{ textAlign: 'right' }}>
                      <EditIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowEditScreen(true)}
                      />
                    </div>
                    <Typography variant='h5' component='h2'>
                      {userStore.currentUser.name}
                    </Typography>
                    <br />
                    <Typography color='textSecondary'>{userStore.currentUser.email}</Typography>
                  </CardContent>
                  <br />
                  <Button variant='contained' color='secondary' onClick={logout}>
                    Logout
                  </Button>
                </Card>
              </Grid>
            </Grid>
          }
        />
      )}
    </Observer>
  )
}

export default ProfilePage
