import React, { useState, useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { Link, withRouter } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'

import userStore from './../../store/UserStore'
import appStore from './../../store/AppStore'

import { Constants } from './../../scripts/constants'
import { asyncForEach } from './../../scripts/localActions'
import { logout } from './../../scripts/remoteActions'

const AuthChecker = (props) => {
  const [showLoader, setShowLoader] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const [intervalId, setIntervalId] = useState(null)
  const [removeInterval, setRemoveInterval] = useState(false)

  useEffect(() => {
    const dbDump = {}
    const dbRequest = window.indexedDB.open('firebaseLocalStorageDb')
    dbRequest.onsuccess = () => {
      const db = dbRequest.result
      const stores = ['firebaseLocalStorage']

      const tx = db.transaction(stores)
      asyncForEach(
        stores,
        (store, next) => {
          const req = tx.objectStore(store).getAll()
          req.onsuccess = () => {
            dbDump[store] = req.result
            next()
          }
        },
        () => {
          if (dbDump.firebaseLocalStorage) {
            dbDump.firebaseLocalStorage.forEach((obj) => {
              if (obj.fbase_key && obj.fbase_key.startsWith('firebase:authUser')) {
                setUserExists(true)
              }
            })
          }
        }
      )
    }
  }, [])

  useEffect(() => {
    if (userExists) {
      setShowLoader(true)
      setIntervalId(
        setInterval(() => {
          if (userStore.isLoggedIn) {
            setShowLoader(false)
            setRemoveInterval(true)
          }
        }, 500)
      )
    }
  }, [userExists])

  useEffect(() => {
    if (removeInterval && userStore.isLoggedIn) {
      clearInterval(intervalId)
    }
  }, [removeInterval, intervalId])

  if (showLoader) {
    return (
      <Observer>
        {() => (
          <div
            className='center-flex-column'
            style={{
              height: '20vh',
            }}>
            <CircularProgress size={60} color={appStore.darkMode ? 'secondary' : 'primary'} />
          </div>
        )}
      </Observer>
    )
  }

  return (
    <Observer>
      {() => (
        <>
          {userStore.isLoggedIn ? (
            <>
              {userStore.currentUser.isAdmin || userStore.currentUser.isActive ? (
                <>{props.children}</>
              ) : (
                <Container fixed style={{ textAlign: 'center', marginTop: '15vh' }}>
                  <h2>You are not authorized to use this application</h2>
                  <h2>Please ask admin to activate your account</h2>
                  <Button
                    variant='contained'
                    color='secondary'
                    style={{ marginLeft: '10px' }}
                    onClick={logout}>
                    Logout
                  </Button>
                </Container>
              )}
            </>
          ) : (
            <Container fixed style={{ textAlign: 'center', marginTop: '15vh' }}>
              <h2>You need to login to use this application</h2>
              <Link
                to={Constants.mainConfigs.allPaths.routes.Login.route}
                style={{
                  textDecoration: 'none',
                  padding: 10,
                }}>
                <Button variant='contained' color='primary' style={{ marginLeft: '10px' }}>
                  Login
                </Button>
              </Link>
            </Container>
          )}
        </>
      )}
    </Observer>
  )
}

export default withRouter(AuthChecker)
