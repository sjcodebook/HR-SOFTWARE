import React, { useEffect } from 'react'
import { Observer } from 'mobx-react-lite'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import './App.scss'

import Layout from './components/common/Layout'

import MainPage from './pages/MainPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

import { Constants } from './scripts/constants'
import { setAuthStateChangeListener } from './scripts/remoteActions'

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export const App = () => {
  useEffect(() => {
    setAuthStateChangeListener()
  })

  return (
    <Observer>
      {() => (
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
          }}>
          <Router>
            <Layout>
              <Switch>
                <Route
                  exact
                  path={Constants.mainConfigs.allPaths.Others.routes.Home.route}
                  component={MainPage}
                />
                <Route
                  exact
                  path={Constants.mainConfigs.allPaths.Others.routes.Admin.route}
                  component={AdminPage}
                />
                <Route component={NotFoundPage} />
              </Switch>
            </Layout>
          </Router>
        </ErrorBoundary>
      )}
    </Observer>
  )
}

export default App
