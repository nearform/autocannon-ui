import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Progress } from 'react-sweet-progress'
import 'react-sweet-progress/lib/style.css'
import Container from '@material-ui/core/Container'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

import ResultsView from './ResultsView.jsx'
import './TestOptions.css'

export default function TestOptions() {
  const [url, setUrl] = useState('https://google.com')
  const [connections, setConnections] = useState(10)
  const [pipelining, setPipelining] = useState(1)
  const [duration, setDuration] = useState(10)
  const [method, setMethod] = useState('GET')
  const [progress, setProgress] = useState(0)
  const [progressStatus, setProgressStatus] = useState('active')
  const [testResults, setTestResults] = useState('')
  const [isTestRunning, setIsTestRunning] = useState(false)

  const RunTestHandler = async event => {
    event.preventDefault()

    function resetState() {
      setIsTestRunning(true)
      setProgressStatus('active')
      setProgress(0)
      setTestResults('')
    }

    resetState()
    const response = await fetch('/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url, connections, method, duration, pipelining })
    })
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      // change this logic
      let receivedvalue
      if (value.includes('duration')) {
        receivedvalue = value.replace('{"progress":90}', '')
      } else {
        receivedvalue = JSON.parse(value)
      }
      if (Number.isInteger(receivedvalue.progress)) {
        setProgress(JSON.parse(value).progress)
      } else {
        setProgress(100)
        setProgressStatus('success')
        setTestResults(receivedvalue)
        setIsTestRunning(false)
      }
    }
  }

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Grid container spacing={1}>
          <div>
            <form>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <label>Test URL</label>
                </Grid>
                <Grid item xs={3}>
                  <input
                    type="text"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <label>Method</label>
                </Grid>
                <Grid item xs={2}>
                  <input
                    type="text"
                    required
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <label>Connections</label>
                </Grid>
                <Grid item xs={2}>
                  <input
                    type="number"
                    value={connections}
                    onChange={e => setConnections(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <label>Pipelining</label>
                </Grid>
                <Grid item xs={2}>
                  <input
                    type="number"
                    value={pipelining}
                    onChange={e => setPipelining(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <label>Duration</label>
                </Grid>
                <Grid item xs={2}>
                  <input
                    type="number"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  />
                </Grid>
              </Grid>

              <br></br>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={3}>
                  <label>Progress</label>
                </Grid>
                <Grid item xs={9}>
                  <Progress
                    percent={progress}
                    status={progressStatus}
                    theme={{
                      success: {
                        symbol: '✔',
                        color: '#39B239'
                      },
                      active: {
                        symbol: '😆',
                        color: '#fbc630'
                      },
                      default: {
                        symbol: '🙂',
                        color: '#fbc630'
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <br></br>
              <Grid container item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={isTestRunning}
                  // className={classes.button}
                  endIcon={<Icon>send</Icon>}
                  onClick={e => {
                    RunTestHandler(e)
                  }}
                >
                  Run Test
                </Button>
              </Grid>
            </form>
            <ResultsView data={testResults} />
          </div>
        </Grid>
      </Container>
    </React.Fragment>
  )
}
