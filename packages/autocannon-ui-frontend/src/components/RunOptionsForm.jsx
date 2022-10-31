import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Container,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import T from 'prop-types'
import HelpIcon from '@mui/icons-material/Help'

import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

import ProgressBar from './ProgressBar'
import logo from '../assets/autocannon-banner.png'

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

const PREFIX = 'RunOptionsForm'
const classes = {
  actionSection: `${PREFIX}-actionSection`,
  advancedOptionsButton: `${PREFIX}-advancedOptionsButton`,
  errorSection: `${PREFIX}-errorSection`,
  form: `${PREFIX}-form`,
  gridContainer: `${PREFIX}-gridContainer`,
  helpIcon: `${PREFIX}-helpIcon`,
  logo: `${PREFIX}-logo`,
  progressBar: `${PREFIX}-progressBar`,
  runButton: `${PREFIX}-runButton`,
  textArea: `${PREFIX}-textArea`
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.form}`]: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  [`& .${classes.logo}`]: {
    maxWidth: '70%',
    display: 'block',
    margin: 'auto',
    padding: theme.spacing(1)
  },
  [`& .${classes.helpIcon}`]: {
    fontSize: 'medium',
    cursor: 'default'
  },
  [`& .${classes.advancedOptionsButton}`]: {
    fontWeight: 'bold',
    textTransform: 'initial'
  },
  [`& .${classes.runButton}`]: {
    borderRadius: theme.spacing(3),
    paddingLeft: theme.spacing(6.5),
    paddingRight: theme.spacing(6.5),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    fontSize: 'x-large'
  },
  [`& .${classes.actionSection}`]: {
    padding: theme.spacing(2)
  },
  [`& .${classes.progressBar}`]: {
    padding: theme.spacing(2)
  },
  [`& .${classes.errorSection}`]: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1)
  },
  [`& .${classes.textArea}`]: {
    resize: 'vertical',
    width: '100%',
    padding: '0.8rem'
  },
  [`& .${classes.gridContainer}`]: {
    margin: 0
  }
}))

export default function RunOptionsForm(props) {
  const [options, setOptions] = useState(
    () =>
      JSON.parse(window.localStorage.getItem('autoCannon_options')) ||
      DEFAULT_OPTIONS
  )
  const [progress, setProgress] = useState(0)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [request, setRequest] = useState()
  const [errorMessage, setErrorMessage] = useState()
  const [invalid, setInvalid] = useState(false)
  const [validationResults, setValidationResults] = useState({})
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  useEffect(() => {
    window.localStorage.setItem('autoCannon_options', JSON.stringify(options))
  }, [options])

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

  const handleShowAdvancedOptions = useCallback(e => {
    e.preventDefault()
    setShowAdvancedOptions(prev => !prev)
  }, [])

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
      props.onNewResults({
        ...result,
        options
      })
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
    <Root>
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
                        <HelpIcon
                          color="primary"
                          className={classes.helpIcon}
                        />
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
                        <HelpIcon
                          color="primary"
                          className={classes.helpIcon}
                        />
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
                        <HelpIcon
                          color="primary"
                          className={classes.helpIcon}
                        />
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
                    className={classes.advancedOptionsButton}
                    color="primary"
                    onClick={handleShowAdvancedOptions}
                  >
                    {!showAdvancedOptions ? 'Show' : 'Hide'} advanced options
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} hidden={!showAdvancedOptions}>
                <Fade in={showAdvancedOptions}>
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
                        minRows={4}
                        onChange={e => onOptionChange('headers', e)}
                        className={classes.textArea}
                        value={options.headers}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Typography
                          align="left"
                          color="textPrimary"
                          variant="h5"
                        >
                          Body
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextareaAutosize
                        id="body"
                        aria-label="body"
                        placeholder='Example: {"key1":"value1", "key2":"value2"}'
                        minRows={10}
                        onChange={e => onOptionChange('body', e)}
                        className={classes.textArea}
                        value={options.body}
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
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                  className={classes.gridContainer}
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
    </Root>
  )
}

RunOptionsForm.propTypes = {
  onNewResults: T.func
}
