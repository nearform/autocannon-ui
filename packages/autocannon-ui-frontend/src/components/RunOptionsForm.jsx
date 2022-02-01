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
  Button,
  TextareaAutosize,
  Fade,
  Typography
} from '@material-ui/core'
import T from 'prop-types'
import HelpIcon from '@material-ui/icons/Help'

import ProgressBar from './ProgressBar'
import logo from '../assets/autocannon-banner.png'
import { Alert } from '@material-ui/lab'

const DEFAULT_OPTIONS = {
  url: 'https://google.com',
  connections: 10,
  pipelining: 1,
  duration: 10,
  method: 'GET',
  timeout: 10,
  title: '',
  headers: '',
  body: ''
}

const useStyles = makeStyles(theme => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  logo: {
    maxWidth: '70%',
    display: 'block',
    margin: 'auto',
    padding: theme.spacing(1)
  },
  helpIcon: {
    fontSize: 'medium',
    cursor: 'default'
  },
  runButton: {
    borderRadius: theme.spacing(2),
    height: '2.8rem'
  },
  actionSection: {
    padding: theme.spacing(2)
  },
  progressBar: {
    padding: theme.spacing(2)
  },
  errorSection: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1)
  },
  textArea: {
    resize: 'vertical',
    width: '100%',
    padding: '0.8rem'
  }
}))

export default function RunOptionsForm(props) {
  const classes = useStyles()

  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [progress, setProgress] = useState(0)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [request, setRequest] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [invalid, setInvalid] = useState(false)
  const [validationResults, setValidationResults] = useState({})
  const [showMore, setShowMore] = useState(false)

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

  const handleShowMore = () => {
    setShowMore(prev => !prev)
  }

  const runButtonHandler = async () => {
    setIsTestRunning(true)
    setProgress(0)
    setErrorMessage()

    const controller = new AbortController()
    const promise = runTest(controller.signal)
    promise.cancel = () => controller.abort()
    setRequest(promise)
    try {
      const result = await promise
      props.onNewResults(result)
    } catch (e) {
      if (e.name !== 'AbortError') {
        setErrorMessage(e.message)
      }
    } finally {
      setIsTestRunning(false)
    }
  }

  const runTest = async signal => {
    const response = await fetch(`${import.meta.env.VITE_API}/api/execute`, {
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
                  inputProps: { min: 1 }
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
                  inputProps: { min: 1 }
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
                  inputProps: { min: 1 }
                }}
                value={options.duration}
                onChange={e => onOptionChange('duration', e)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  className={classes.runButton}
                  color="primary"
                  variant="outlined"
                  onClick={handleShowMore}
                >
                  {!showMore ? 'Show More' : 'Show Less'}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} hidden={!showMore}>
              <Fade in={showMore}>
                <Grid container spacing={3}>
                  <Grid item xs={8}>
                    <TextField
                      id="title"
                      label="Title"
                      variant="outlined"
                      value={options.title}
                      onChange={e => onOptionChange('title', e)}
                      error={validationResults.url}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      id="timeout"
                      label="Timeout"
                      variant="outlined"
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <Tooltip title="The number of seconds before timing out and resetting a connection.">
                            <HelpIcon
                              color="primary"
                              className={classes.helpIcon}
                            />
                          </Tooltip>
                        ),
                        inputProps: { min: 1 }
                      }}
                      value={options.timeout}
                      onChange={e => onOptionChange('timeout', e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography align="left" color="textPrimary" variant="h6">
                      Headers
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      id="headers"
                      aria-label="headers"
                      placeholder='Example: {"accept":"text/plain", "Content-Type":"application/json" }'
                      rowsMin={4}
                      onChange={e => onOptionChange('headers', e)}
                      className={classes.textArea}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography align="left" color="textPrimary" variant="h5">
                        Body
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextareaAutosize
                      id="body"
                      aria-label="body"
                      placeholder='Example: {"key1":"value1", "key2":"value2"}'
                      rowsMin={10}
                      onChange={e => onOptionChange('body', e)}
                      className={classes.textArea}
                    />
                  </Grid>
                </Grid>
              </Fade>
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
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={cancelTest}
                  data-testid="cancel-run-button"
                >
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
                data-testid="run-button"
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
