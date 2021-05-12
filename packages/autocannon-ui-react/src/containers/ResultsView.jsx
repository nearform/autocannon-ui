import Grid from '@material-ui/core/Grid'
import React from 'react'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import prettyBytes from 'pretty-bytes'
import { percentiles } from 'hdr-histogram-percentiles-obj'

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
})

function asBytes(stat) {
  const result = Object.create(stat)

  for (const p of percentiles) {
    const key = `p${p}`.replace('.', '_')
    result[key] = prettyBytes(stat[key])
  }

  result.average = prettyBytes(stat.average)
  result.stddev = prettyBytes(stat.stddev)
  result.max = prettyBytes(stat.max)
  result.min = prettyBytes(stat.min)
  return result
}

function createLatencyTable(stat, p2_5, p50, p97_5, p99, average, stddev, max) {
  return {
    stat,
    p2_5,
    p50,
    p97_5,
    p99,
    average,
    stddev,
    max
  }
}

function createRequestsTable(stat, p1, p2_5, p50, p97_5, average, stddev, min) {
  return {
    stat,
    p1,
    p2_5,
    p50,
    p97_5,
    average,
    stddev,
    min
  }
}

export default function ResultsView({ data }) {
  const classes = useStyles()

  if (!data) {
    return null
  }

  const latencyData = data.latency
  const requestsData = data.requests
  const bytesData = asBytes(data.throughput)

  const latencyRows = [
    createLatencyTable(
      'Latency',
      latencyData.p2_5,
      latencyData.p50,
      latencyData.p97_5,
      latencyData.p99,
      latencyData.average,
      latencyData.stddev,
      latencyData.max
    )
  ]

  const requestsRows = [
    createRequestsTable(
      'Req/Sec',
      requestsData.p1,
      requestsData.p2_5,
      requestsData.p50,
      requestsData.p97_5,
      requestsData.average,
      requestsData.stddev,
      requestsData.min
    )
  ]

  const bytesRows = [
    createRequestsTable(
      'Bytes/Sec',
      bytesData.p1,
      bytesData.p2_5,
      bytesData.p50,
      bytesData.p97_5,
      bytesData.average,
      bytesData.stddev,
      bytesData.min
    )
  ]

  const percentileRows = [
    { 0.001: latencyData.p0_001 },
    { 0.01: latencyData.p0_01 },
    { 0.1: latencyData.p0_1 },
    { 1: latencyData.p1 },
    { 2.5: latencyData.p2_5 },
    { 10: latencyData.p10 },
    { 25: latencyData.p25 },
    { 50: latencyData.p50 },
    { 75: latencyData.p75 },
    { 90: latencyData.p90 },
    { 97.5: latencyData.p97_5 },
    { 99: latencyData.p99 },
    { 99.9: latencyData.p99_9 },
    { 99.99: latencyData.p99_99 },
    { 99.999: latencyData.p99_999 }
  ]

  return (
    <React.Fragment>
      <Container maxWidth="lg">
        <br></br>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <label>Test Results</label>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Stat</TableCell>
                    <TableCell align="right">2.5%</TableCell>
                    <TableCell align="right">50%</TableCell>
                    <TableCell align="right">97.5%</TableCell>
                    <TableCell align="right">99%</TableCell>
                    <TableCell align="right">Avg</TableCell>
                    <TableCell align="right">Stddev</TableCell>
                    <TableCell align="right">Max</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {latencyRows.map(row => (
                    <TableRow key={row.stat}>
                      <TableCell component="th" scope="row">
                        {row.stat}
                      </TableCell>
                      <TableCell align="right">{row.p2_5}</TableCell>
                      <TableCell align="right">{row.p50}</TableCell>
                      <TableCell align="right">{row.p97_5}</TableCell>
                      <TableCell align="right">{row.p99}</TableCell>
                      <TableCell align="right">{row.average}</TableCell>
                      <TableCell align="right">{row.stddev}</TableCell>
                      <TableCell align="right">{row.max}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <br></br>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Stat</TableCell>
                    <TableCell align="right">1%</TableCell>
                    <TableCell align="right">2.5%</TableCell>
                    <TableCell align="right">50%</TableCell>
                    <TableCell align="right">97.5%</TableCell>
                    <TableCell align="right">Avg</TableCell>
                    <TableCell align="right">Stddev</TableCell>
                    <TableCell align="right">Min</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requestsRows.map(row => (
                    <TableRow key={row.stat}>
                      <TableCell component="th" scope="row">
                        {row.stat}
                      </TableCell>
                      <TableCell align="right">{row.p1}</TableCell>
                      <TableCell align="right">{row.p2_5}</TableCell>
                      <TableCell align="right">{row.p50}</TableCell>
                      <TableCell align="right">{row.p97_5}</TableCell>
                      <TableCell align="right">{row.average}</TableCell>
                      <TableCell align="right">{row.stddev}</TableCell>
                      <TableCell align="right">{row.min}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableBody>
                  {bytesRows.map(row => (
                    <TableRow key={row.stat}>
                      <TableCell component="th" scope="row">
                        {row.stat}
                      </TableCell>
                      <TableCell align="right">{row.p1}</TableCell>
                      <TableCell align="right">{row.p2_5}</TableCell>
                      <TableCell align="right">{row.p50}</TableCell>
                      <TableCell align="right">{row.p97_5}</TableCell>
                      <TableCell align="right">{row.average}</TableCell>
                      <TableCell align="right">{row.stddev}</TableCell>
                      <TableCell align="right">{row.min}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={8}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Percentile</TableCell>
                    <TableCell align="left">Latency (ms)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {percentileRows.map((key, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {Object.keys(key)[0]}
                      </TableCell>
                      <TableCell align="left">
                        {Object.values(key)[0]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

ResultsView.propTypes = {
  data: PropTypes.object
}
