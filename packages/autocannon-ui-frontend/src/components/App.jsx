import React, { useState } from 'react'

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles'

import { CssBaseline, Container, Box, Button } from '@material-ui/core'

import RunOptions from './RunOptions.jsx'
import ProgressBar from './ProgressBar.jsx'
import ResultsView from './ResultsView.jsx'

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
  }
}))

function App() {
  const classes = useStyles()

  const [url, setUrl] = useState('https://google.com')
  const [connections, setConnections] = useState(10)
  const [pipelining, setPipelining] = useState(1)
  const [duration, setDuration] = useState(10)
  const [method, setMethod] = useState('GET')

  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState()
  const [isTestRunning, setIsTestRunning] = useState(false)

  function resetState() {
    setIsTestRunning(true)
    setProgress(0)
    setResults()
  }

  const runTest = async () => {
    resetState()
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, connections, pipelining, duration, method })
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

      const [, type, payload] = /^(\w+):(.+)/.exec(value)
      if (type === 'progress') {
        setProgress(+payload)
      } else {
        setProgress(100)
        setResults(JSON.parse(payload))
        setIsTestRunning(false)
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <RunOptions
          url={url}
          onUrlChange={setUrl}
          connections={connections}
          onConnectionsChange={setConnections}
          pipelining={pipelining}
          onPipeliningChange={setPipelining}
          duration={duration}
          onDurationChange={setDuration}
          method={method}
          onMethodChange={setMethod}
        />

        <Container maxWidth="sm" className={classes.actionSection}>
          <Box display="flex" justifyContent="center">
            {isTestRunning && <ProgressBar value={progress} />}
            {!isTestRunning && (
              <Button
                className={classes.runButton}
                variant="contained"
                color="primary"
                size="large"
                onClick={runTest}
              >
                Run Test
              </Button>
            )}
          </Box>
        </Container>

        <ResultsView data={results} />
      </Container>
    </ThemeProvider>
  )
}

export default App
