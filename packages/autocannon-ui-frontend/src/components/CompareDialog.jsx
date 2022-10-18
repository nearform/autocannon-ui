import React, { useState, useEffect, useMemo } from 'react'
import T from 'prop-types'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Grid,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

const PREFIX = 'CompareDialog'
const classes = {
  dialog: `${PREFIX}-dialog`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogContent: `${PREFIX}-dialogContent`,
  closeButton: `${PREFIX}-closeButton`,
  statHeader: `${PREFIX}-statHeader`
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.dialog}`]: {
    margin: `0 ${theme.spacing(2.5)}`
  },
  [`& .${classes.dialogTitle}`]: {
    paddingRight: theme.spacing(6)
  },
  [`& .${classes.dialogContent}`]: {
    padding: 0
  },
  [`& .${classes.closeButton}`]: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  [`& .${classes.statHeader}`]: {
    fontWeight: 'bold'
  }
}))

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
  const { result, isLoading, errorMessage } = useCompareResult(data)

  const printHeader = winner => {
    if (winner) {
      return `${winner.resultIndex} ${winner.title || winner.url} | ${new Date(
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
    <Root>
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
                        <TableCell>
                          {' '}
                          {result?.throughput.significant}{' '}
                        </TableCell>
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
    </Root>
  )
}

CompareDialog.propTypes = {
  data: T.array.isRequired,
  onClose: T.func.isRequired
}
