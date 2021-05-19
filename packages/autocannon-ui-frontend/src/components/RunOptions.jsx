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

  function onOptionChange(option, value) {
    props.onOptionsChange({ ...props.options, [option]: value })
  }

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
                value={props.options.url}
                onChange={e => onOptionChange('url', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="method"
                label="Method"
                variant="outlined"
                value={props.options.method}
                onChange={e => onOptionChange('method', e.target.value)}
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
                value={props.options.connections}
                onChange={e => onOptionChange('connections', e.target.value)}
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
                value={props.options.pipelining}
                onChange={e => onOptionChange('pipelining', e.target.value)}
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
                value={props.options.duration}
                onChange={e => onOptionChange('duration', e.target.value)}
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
  options: T.object,
  onOptionsChange: T.func
}
