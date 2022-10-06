import React from 'react'
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
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  statHeader: {
    fontWeight: 'bold'
  }
})

export default function CompareDialog({ data, onClose }) {
  const classes = useStyles()
  const [isLoading, setIsLoading] = React.useState(true)
  const [result, setResult] = React.useState()
  const [errorMessage, setErrorMessage] = React.useState()

  React.useEffect(() => {
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
              a: data[0],
              b: data[1]
            })
          }
        )
        if (!response.ok) {
          throw new Error(`Something went wrong! Status: ${response.status}`)
        }
        setResult(await response.json())
      } catch (e) {
        setErrorMessage(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCompareResult()
  }, [data])

  const headerMemo = React.useMemo(() => {
    let winner
    if (result?.aWins) winner = data[0]
    if (result?.bWins) winner = data[1]
    return winner
      ? `${winner.title ? winner.title : winner.url} | ${new Date(
          winner.start
        ).toLocaleString()} Wins`
      : 'The results are equal.'
  }, [result, data])

  return (
    <Dialog
      open
      className={classes.dialog}
      maxWidth="md"
      onClose={onClose}
      data-testid="compare-dialog"
    >
      {isLoading ? (
        <CircularProgress />
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <>
          <DialogTitle>
            {headerMemo}
            <IconButton className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
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
                      <TableCell> {result?.requests.pValue} </TableCell>
                      <TableCell> {result?.throughput.pValue} </TableCell>
                      <TableCell> {result?.latency.pValue} </TableCell>
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
