import React from 'react'
import { Observer } from 'mobx-react-lite'

import AuthChecker from './../components/common/AuthChecker'
import Dashboard from './../components/Dashboard'

const MainPage = () => {
  return (
    <Observer>
      {() => <AuthChecker children={<Observer>{() => <Dashboard />}</Observer>} />}
    </Observer>
  )
}

export default MainPage
