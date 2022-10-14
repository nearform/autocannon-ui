import React, { useState, useCallback } from 'react'

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
    marginTop: theme.spacing(2),
    border: 'solid #d6d6d6 1px',
    borderRadius: 4
  },
  buttonsContainer: {
    gap: '1rem'
  }
}))

const MAX_SELECTED_RESULTS = 2

function App() {
  const classes = useStyles()

  const [results, setResults] = useState([])
  const [selectedResults, setSelectedResults] = useState([])
  const [isOpenCompareDialog, setIsOpenCompareDialog] = useState(false)

  const handleOnReceivedResults = useCallback(resultSet => {
    setResults(results => {
      return results.concat(resultSet).map((result, index) => {
        return {
          ...result,
          resultIndex: index + 1,
          isSelected: result.isSelected || false
        }
      })
    })
  }, [])

  const handleOnSelectResultSet = useCallback(
    (resultSet, isSelected) => {
      results.forEach(result => {
        if (result == resultSet) {
          result.isSelected = isSelected
        }
      })
      setSelectedResults(results.filter(result => result.isSelected))
    },
    [results]
  )

  const toggleIsOpenCompareDialog = useCallback(() => {
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
              disabled={selectedResults.length !== MAX_SELECTED_RESULTS}
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
