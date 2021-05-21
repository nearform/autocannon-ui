import React, { useState } from 'react'

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles'

import { CssBaseline, Container, Grid, Button } from '@material-ui/core'
import '@fontsource/roboto'

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
  },
  resultsGrid: {
    flexDirection: 'column-reverse'
  },
  clearButton: {
    margin: theme.spacing(2, 0)
  }
}))

function App() {
  const classes = useStyles()

  const [results, setResults] = useState([])

  function resultsReceivedHandler(resultSet) {
    setResults(results => [...results, resultSet])
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
            <Button
              variant="outlined"
              color="primary"
              className={classes.clearButton}
              onClick={() => setResults([])}
              data-testid="clear-all-button"
            >
              Clear all
            </Button>
          </Grid>
        )}

        <Grid container justify="flex-start" className={classes.resultsGrid}>
          {results.map((resultSet, index) => {
            return (
              <Grid item key={index}>
                <ResultSet data={resultSet} />
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </ThemeProvider>
  )
}

export default App
