import React, { useState } from 'react'

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles'

import { CssBaseline, Container, Grid, Button, Box } from '@material-ui/core'

import RunOptionsForm from './RunOptionsForm.jsx'
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
  }
}))

function App() {
  const classes = useStyles()

  const [results, setResults] = useState([])

  function resultsReceivedHandler(resultSet) {
    setResults(results => [resultSet, ...results])
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <RunOptionsForm onNewResults={resultsReceivedHandler} />

        {results.length > 0 && (
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Box p={3}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setResults([])}
              >
                Clear all
              </Button>
            </Box>
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
