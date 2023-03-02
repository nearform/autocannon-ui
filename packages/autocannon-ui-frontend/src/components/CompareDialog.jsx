import React, { useState, useEffect } from 'react'
import T from 'prop-types'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Alert from '@mui/material/Alert'

const Kind = {
  lessIsBetter: 'lessIsBetter',
  moreIsBetter: 'moreIsBetter'
}

function getDiffStyle(row) {
  if (row.diff.startsWith('+')) {
    return { color: row.kind === Kind.lessIsBetter ? 'red' : 'green' }
  }
  if (row.diff.startsWith('-')) {
    return { color: row.kind === Kind.lessIsBetter ? 'green' : 'red' }
  }
}

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
    <Dialog open className={'compare-dialog'} maxWidth="md" onClose={onClose}>
      {isLoading ? (
        <CircularProgress />
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : (
        <>
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Typography variant="subtitle">Compare results</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Measure</TableCell>
                    <TableCell>Difference</TableCell>
                    <TableCell>#{data[0].resultIndex}</TableCell>
                    <TableCell>#{data[1].resultIndex}</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {result.map(row => {
                    const diffStyle = getDiffStyle(row)

                    return (
                      <TableRow key={row.measure}>
                        <TableCell>{row.measure}</TableCell>
                        <TableCell sx={diffStyle}>{row.diff}</TableCell>
                        <TableCell>{row.a}</TableCell>
                        <TableCell>{row.b}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
