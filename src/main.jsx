import React from 'react'
import ReactDOM from 'react-dom/client'
import SimpleReactLightbox from 'simple-react-lightbox'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'

import App from './App'

window.global = window

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleReactLightbox>
      <MuiPickersUtilsProvider utils={DayjsUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </SimpleReactLightbox>
  </React.StrictMode>
)
