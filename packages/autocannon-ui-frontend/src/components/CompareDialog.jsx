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
  statHeader: `${PREFIX}-statHeader`,
  positive: `${PREFIX}-positive`,
  negative: `${PREFIX}-negative`
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
  },
  [`& .${classes.positive}`]: {
    color: 'green'
  },
  [`& .${classes.negative}`]: {
    color: 'red'
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
          `${import.meta.env.VITE_API}/api/compare-v2`,
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
                        <TableCell>Measure</TableCell>
                        <TableCell>Difference</TableCell>
                        <TableCell>a</TableCell>
                        <TableCell>b</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {result.map(row => {
                        const getClassName = () => {
                          if (row.diff.startsWith('+')) {
                            return classes.positive
                          }
                          if (row.diff.startsWith('-')) {
                            return classes.negative
                          }

                          return ''
                        }

                        return (
                          <TableRow>
                            <TableCell className={getClassName()}>
                              {row.measure}
                            </TableCell>
                            <TableCell className={getClassName()}>
                              {row.diff}
                            </TableCell>
                            <TableCell className={getClassName()}>
                              {row.a}
                            </TableCell>
                            <TableCell className={getClassName()}>
                              {row.b}
                            </TableCell>
                          </TableRow>
                        )
                      })}
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
