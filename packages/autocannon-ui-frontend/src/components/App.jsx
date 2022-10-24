import React, { useState, useCallback } from 'react'

import '@fontsource/roboto'

import { Button, Container, CssBaseline, Grid } from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'

import CompareDialog from './CompareDialog'
import ResultSet from './ResultSet'
import RunOptionsForm from './RunOptionsForm'

const theme = createTheme({
  palette: {
    primary: {
      main: '#00818f'
    }
  }
})

const PREFIX = 'App'
const classes = {
  paper: `${PREFIX}-paper`,
  resultsGrid: `${PREFIX}-resultsGrid`,
  resultsGridItem: `${PREFIX}-resultsGridItem`,
  buttonsContainer: `${PREFIX}-buttonsContainer`
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.paper}`]: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  [`& .${classes.resultsGrid}`]: {
    flexDirection: 'column-reverse',
    marginBottom: theme.spacing(2)
  },
  [`& .${classes.resultsGridItem}`]: {
    marginTop: theme.spacing(2),
    border: `solid ${theme.palette.grey[400]} 1px`,
    borderRadius: 4
  },
  [`& .${classes.buttonsContainer}`]: {
    gap: '1rem'
  }
}))

const MAX_SELECTED_RESULTS = 2

function App() {
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
      <Root>
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
      </Root>
    </ThemeProvider>
  )
}

export default App
