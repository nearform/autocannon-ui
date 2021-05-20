import React, { useState } from 'react'

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles'

import {
  CssBaseline,
  Container,
  Box,
  Grid,
  Button
} from '@material-ui/core'
import {
  Alert
} from '@material-ui/lab'

import RunOptions from './RunOptions.jsx'
import ProgressBar from './ProgressBar.jsx'
import ResultSet from './ResultSet.jsx'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00818f'
    }
  }
})

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  runButton: {
    borderRadius: '30px'
  },
  actionSection: {
    padding: '20px 0px'
  },
  errorSection: {
    padding: '20px',
    borderRadius: '5px'
  },
  progressBar: {
    padding: '30px'
  }
}))

function App() {
  const classes = useStyles()

  const [options, setOptions] = useState({
    url: 'https://google.com',
    connections: 10,
    pipelining: 1,
    duration: 10,
    method: 'GET'
  })

  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState([])
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [request, setRequest] = useState()
  const [errorMessage, setErrorMessage] = useState()

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
        setResults(results => [result, ...results])
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
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <RunOptions options={options} onOptionsChange={setOptions} />

        {errorMessage && (
          <Container maxWidth="sm" className={classes.errorSection}>
            <Alert severity="error">{errorMessage}</Alert>
          </Container>
        )}

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
                onClick={runButtonHandler}
              >
                Run Test
              </Button>
            )}
          </Box>
        </Container>

        {results.length > 0 && (
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setResults([])}
            >
              Clear all
            </Button>
          </Grid>
        )}

        {results.map((resultSet, index) => {
          return <ResultSet key={index} data={resultSet} />
        })}
      </Container>
    </ThemeProvider>
  )
}

export default App
