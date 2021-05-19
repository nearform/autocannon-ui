import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Container, TextField } from '@material-ui/core'
import T from 'prop-types'

import logo from '../assets/autocannon-banner.png'

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  logo: {
    maxWidth: '70%',
    display: 'block',
    margin: 'auto',
    padding: '10px'
  }
}))

export default function RunOptions(props) {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <img src={logo} alt="AutoCannon" className={classes.logo} />

        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="url"
                label="Test URL"
                variant="outlined"
                value={props.url}
                onChange={e => props.onUrlChange(e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="method"
                label="Method"
                variant="outlined"
                value={props.method}
                onChange={e => props.onMethodChange(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="connections"
                label="Connections"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={props.connections}
                onChange={e => props.onConnectionsChange(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="pipelining"
                label="Pipelining"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={props.pipelining}
                onChange={e => props.onPipeliningChange(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="duration"
                label="Duration"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={props.duration}
                onChange={e => props.onDurationChange(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  )
}

RunOptions.propTypes = {
  url: T.string,
  onUrlChange: T.func,
  connections: T.number,
  onConnectionsChange: T.func,
  pipelining: T.number,
  onPipeliningChange: T.func,
  duration: T.number,
  onDurationChange: T.func,
  method: T.string,
  onMethodChange: T.func
}
