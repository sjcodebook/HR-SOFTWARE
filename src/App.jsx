import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import yall from 'yall-js'

import './App.scss'

import Layout from './components/common/Layout'

import MainPage from './pages/MainPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

import { Constants } from './scripts/constants'
import { setAuthStateChangeListener } from './scripts/remoteActions'

function App() {
  useEffect(() => {
    document.addEventListener('DOMContentLoaded', () => {
      yall({
        observeChanges: true, // For dynamically inserted elements
      })
    })
  }, [])

  useEffect(() => {
    setAuthStateChangeListener()
  })

  return (
    <Observer>
      {() => (
        <Router>
          <Layout>
            <Switch>
              <Route
                exact
                path={Constants.mainConfigs.allPaths.routes.Home.route}
                component={MainPage}
              />
              <Route
                exact
                path={Constants.mainConfigs.allPaths.routes.Login.route}
                component={LoginPage}
              />
              <Route
                exact
                path={Constants.mainConfigs.allPaths.routes.Profile.route}
                component={ProfilePage}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </Layout>
        </Router>
      )}
    </Observer>
  )
}

export default App
