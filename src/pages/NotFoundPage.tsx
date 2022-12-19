import { Link } from 'react-router-dom'

import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import { Constants } from './../scripts/constants'

const NotFoundPage = () => {
  return (
    <Container fixed style={{ marginTop: '20px' }}>
      <Typography variant='h4' align='center' gutterBottom>
        Page Not Found...
      </Typography>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link
          to={Constants.mainConfigs.allPaths.Others.routes.Home.route}
          style={{ textDecoration: 'none' }}>
          <Button variant='contained' color='primary'>
            Go To Home Page
          </Button>
        </Link>
      </div>
    </Container>
  )
}

export default NotFoundPage
