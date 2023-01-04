import React from 'react'
import ReactDOM from 'react-dom/client'
import SimpleReactLightbox from 'simple-react-lightbox'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'

import App from './App'

import '@inovua/reactdatagrid-community/base.css'
import '@inovua/reactdatagrid-community/theme/pink-dark.css'
import '@inovua/reactdatagrid-community/theme/pink-light.css'

window.global = window

ReactDOM.createRoot(document.getElementById('root')).render(
  <SimpleReactLightbox>
    <MuiPickersUtilsProvider utils={DayjsUtils}>
      <App />
    </MuiPickersUtilsProvider>
  </SimpleReactLightbox>
)
