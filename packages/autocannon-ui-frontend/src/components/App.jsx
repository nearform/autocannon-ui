import React, { useState } from 'react'

import {
  createTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles'

import { CssBaseline, Container, Grid, Button } from '@material-ui/core'
import '@fontsource/roboto'

import RunOptionsForm from './RunOptionsForm'
import ResultSet from './ResultSet'

const theme = createTheme({
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
    flexDirection: 'column-reverse',
    marginBottom: theme.spacing(2)
  },
  resultsGridItem: {
    marginTop: theme.spacing(2)
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
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setResults([])}
              data-testid="clear-all-button"
            >
              Clear all
            </Button>
          </Grid>
        )}

        <Grid
          container
          justifyContent="flex-start"
          className={classes.resultsGrid}
        >
          {results.map((resultSet, index) => {
            return (
              <Grid item key={index} className={classes.resultsGridItem}>
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
