import React from 'react'

import {
  createTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core/styles'

import { CssBaseline, Container, Grid, Button } from '@material-ui/core'
import '@fontsource/roboto'

import RunOptionsForm from './RunOptionsForm'
import ResultSet from './ResultSet'
import CompareDialog from './CompareDialog'

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
  },
  buttonsContainer: {
    gap: '1rem'
  }
}))

function App() {
  const classes = useStyles()

  const [results, setResults] = React.useState([])
  const [selectedResults, setSelectedResults] = React.useState([])
  const [isOpenCompareDialog, setIsOpenCompareDialog] = React.useState(false)

  const handleOnReceivedResults = React.useCallback(resultSet => {
    setResults(results => [...results, resultSet])
  }, [])

  const handleOnSelectResultSet = React.useCallback((resultSet, isSelected) => {
    if (isSelected) {
      setSelectedResults(results => [...results, resultSet])
    } else {
      setSelectedResults(results =>
        results.filter(
          item => item.start !== resultSet.start || item.url !== resultSet.url
        )
      )
    }
  }, [])

  const toggleIsOpenCompareDialog = React.useCallback(() => {
    setIsOpenCompareDialog(isOpen => !isOpen)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />

        <RunOptionsForm onNewResults={handleOnReceivedResults} />

        {results.length > 0 && (
          <Grid
            container
            className={classes.buttonsContainer}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="primary"
              onClick={toggleIsOpenCompareDialog}
              disabled={selectedResults.length !== 2}
              data-testid="compare-button"
            >
              Compare
            </Button>
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
          {results.map((resultSet, index) => (
            <Grid item key={index} className={classes.resultsGridItem}>
              <ResultSet
                data={resultSet}
                onChangeSelection={handleOnSelectResultSet}
                isDisableSelection={selectedResults.length === 2}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      {isOpenCompareDialog && (
        <CompareDialog
          data={selectedResults}
          onClose={toggleIsOpenCompareDialog}
        />
      )}
    </ThemeProvider>
  )
}

export default App
