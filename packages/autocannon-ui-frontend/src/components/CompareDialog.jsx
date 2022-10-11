import React, { useState, useEffect, useMemo } from 'react'
import T from 'prop-types'
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  makeStyles,
  Grid,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Alert } from '@material-ui/lab'

const useStyles = makeStyles({
  dialog: {
    margin: '0 20px'
  },
  dialogTitle: {
    paddingRight: '48px'
  },
  dialogContent: {
    padding: 0
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  statHeader: {
    fontWeight: 'bold'
  }
})

const useCompareResult = resultSets => {
  const [isLoading, setIsLoading] = useState(true)
  const [result, setResult] = useState()
  const [errorMessage, setErrorMessage] = useState()
  useEffect(() => {
    const fetchCompareResult = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API}/api/compare`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              a: resultSets[0],
              b: resultSets[1]
            })
          }
        )
        if (!response.ok) {
          throw new Error(response.message)
        }
        setResult(await response.json())
      } catch (e) {
        setErrorMessage(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompareResult()
  }, [resultSets])

  return { isLoading, errorMessage, result }
}

export default function CompareDialog({ data, onClose }) {
  const classes = useStyles()
  const { result, isLoading, errorMessage } = useCompareResult(data)

  const printHeader = winner => {
    if (winner) {
      return `${winner.title || winner.url} ${winner.resultIndex} | ${new Date(
        winner.start
      ).toLocaleString()} Wins`
    }
    return 'The results are equal'
  }
  const headerMemo = useMemo(() => {
    let winner
    if (result?.aWins) winner = data[0]
    if (result?.bWins) winner = data[1]
    return printHeader(winner)
  }, [result, data])

  return (
    <Dialog
      open
      className={classes.dialog + ' compare-dialog'}
      maxWidth="md"
      onClose={onClose}
    >
      {isLoading ? (
        <CircularProgress />
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <>
          <DialogTitle className={classes.dialogTitle}>
            {headerMemo}
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Requests</TableCell>
                      <TableCell>Throughput</TableCell>
                      <TableCell>Latency</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.statHeader}>
                        Difference
                      </TableCell>
                      <TableCell> {result?.requests.difference} </TableCell>
                      <TableCell> {result?.throughput.difference} </TableCell>
                      <TableCell> {result?.latency.difference} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.statHeader}>
                        pValue
                      </TableCell>
                      <TableCell>
                        {result?.requests.pValue?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {result?.throughput.pValue?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {result?.latency.pValue?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.statHeader}>
                        Significance
                      </TableCell>
                      <TableCell> {result?.requests.significant} </TableCell>
                      <TableCell> {result?.throughput.significant} </TableCell>
                      <TableCell> {result?.latency.significant} </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </DialogContent>
        </>
      )}
    </Dialog>
  )
}

CompareDialog.propTypes = {
  data: T.array.isRequired,
  onClose: T.func.isRequired
}
