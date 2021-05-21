import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  Container,
  TextField,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button
} from '@material-ui/core'
import T from 'prop-types'
import HelpIcon from '@material-ui/icons/Help'

import ProgressBar from './ProgressBar.jsx'
import logo from '../assets/autocannon-banner.png'
import { Alert } from '@material-ui/lab'

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
  },
  helpIcon: {
    fontSize: 'medium',
    cursor: 'default'
  },
  runButton: {
    borderRadius: '30px'
  },
  actionSection: {
    padding: '20px 0px'
  },
  progressBar: {
    padding: '30px'
  },
  errorSection: {
    padding: '20px',
    borderRadius: '5px'
  }
}))

export default function RunOptionsForm(props) {
  const classes = useStyles()

  const [options, setOptions] = useState({
    url: 'https://google.com',
    connections: 10,
    pipelining: 1,
    duration: 10,
    method: 'GET'
  })
  const [progress, setProgress] = useState(0)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [request, setRequest] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [invalid, setInvalid] = useState(false)
  const [validationResults, setValidationResults] = useState({})

  function onOptionChange(option, event) {
    if (event.target.required && !event.target.value) {
      setValidationResults(results => ({ ...results, [event.target.id]: true }))
      setInvalid(true)
    } else {
      setValidationResults(results => {
        delete results[event.target.id]
        return results
      })
      setInvalid(Object.keys(validationResults).length > 0)
    }
    setOptions(o => ({ ...o, [option]: event.target.value }))
  }

  const runButtonHandler = () => {
    setIsTestRunning(true)
    setProgress(0)
    setErrorMessage()

    const controller = new AbortController()
    const promise = runTest(controller.signal)
    promise.cancel = () => controller.abort()
    setRequest(promise)
    promise
      .then(result => {
        props.onNewResults(result)
      })
      .catch(e => {
        if (e.name !== 'AbortError') {
          setErrorMessage(e.message)
        }
      })
      .finally(() => {
        setIsTestRunning(false)
      })
  }

  const runTest = async signal => {
    const response = await fetch('/api/execute', {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    })
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader()

    let chunk
    while ((chunk = await reader.read())) {
      const { value, done } = chunk
      if (done) {
        break
      }
      if (!response.ok) {
        const response = JSON.parse(value)
        throw Error(response.message || response)
      }

      const [, type, payload] = /^(\w+):(.+)/.exec(value)
      if (type === 'progress') {
        setProgress(+payload)
      } else {
        setProgress(100)
        return JSON.parse(payload)
      }
    }
  }

  function cancelTest() {
    if (request) {
      request.cancel()
    }
  }

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <img src={logo} alt="AutoCannon" className={classes.logo} />
        {errorMessage && (
          <Container maxWidth="sm" className={classes.errorSection}>
            <Alert severity="error">{errorMessage}</Alert>
          </Container>
        )}
        <form className={classes.form} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="url"
                label="Test URL"
                variant="outlined"
                value={options.url}
                onChange={e => onOptionChange('url', e)}
                error={validationResults.url}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="method-input-label">Method</InputLabel>
                <Select
                  labelId="method-input-label"
                  id="method-input"
                  value={options.method}
                  onChange={e => onOptionChange('method', e)}
                  label="Method"
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="HEAD">HEAD</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  <MenuItem value="OPTIONS">OPTIONS</MenuItem>
                  <MenuItem value="TRACE">TRACE</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="connections"
                label="Connections"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <Tooltip title=" The number of concurrent connections.">
                      <HelpIcon color="primary" className={classes.helpIcon} />
                    </Tooltip>
                  ),
                  inputProps: { min: 0 }
                }}
                value={options.connections}
                onChange={e => onOptionChange('connections', e)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="pipelining"
                label="Pipelining"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <Tooltip title="The number of pipelined requests for each connection. Will cause the Client API to throw when greater than 1.">
                      <HelpIcon color="primary" className={classes.helpIcon} />
                    </Tooltip>
                  ),
                  inputProps: { min: 0 }
                }}
                value={options.pipelining}
                onChange={e => onOptionChange('pipelining', e)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                id="duration"
                label="Duration"
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: (
                    <Tooltip title="The number of seconds to run the autocannon. Can be a timestring.">
                      <HelpIcon color="primary" className={classes.helpIcon} />
                    </Tooltip>
                  ),
                  inputProps: { min: 0 }
                }}
                value={options.duration}
                onChange={e => onOptionChange('duration', e)}
                fullWidth
              />
            </Grid>
          </Grid>
        </form>
        <Container maxWidth="sm" className={classes.actionSection}>
          <Box display="flex" justifyContent="center">
            {isTestRunning && (
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                spacing={3}
              >
                <ProgressBar value={progress} />
                <Button variant="outlined" color="primary" onClick={cancelTest}>
                  Cancel
                </Button>
              </Grid>
            )}
            {!isTestRunning && (
              <Button
                className={classes.runButton}
                variant="contained"
                color="primary"
                size="large"
                disabled={invalid}
                onClick={runButtonHandler}
              >
                Run Test
              </Button>
            )}
          </Box>
        </Container>
      </Container>
    </React.Fragment>
  )
}

RunOptionsForm.propTypes = {
  onNewResults: T.func
}
