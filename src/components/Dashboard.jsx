import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 20,
  },
}))

const Dashboard = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Container fixed>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Typography variant='h3' align='center' gutterBottom>
              Dashboard
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Dashboard
