import React from 'react'
import {
  Accordion,
  AccordionSummary,
  Typography,
  Table,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import T from 'prop-types'
import prettyBytes from 'pretty-bytes'
import HelpIcon from '@material-ui/icons/Help'

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    padding: '30px'
  },
  cardContainer: {
    padding: '30px'
  },
  helpIcon: {
    fontSize: 'medium',
    cursor: 'default'
  },
  tableHeader: {
    padding: '15px'
  },
  statHeader: {
    fontWeight: 'bold'
  }
})

export default function ResultSet({ data }) {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          data-id="result-accordion"
        >
          <Typography>{new Date(data.start).toLocaleString()}</Typography>
        </AccordionSummary>
        <Grid container xs={12} className={classes.cardContainer}>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.tableHeader}>
              <label>Latency</label>
              <Tooltip title="Histogram statistics about response latency.">
                <HelpIcon color="primary" className={classes.helpIcon} />
              </Tooltip>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Stat</TableCell>
                    <TableCell>2.5%</TableCell>
                    <TableCell>50%</TableCell>
                    <TableCell>97.5%</TableCell>
                    <TableCell>99%</TableCell>
                    <TableCell>Avg</TableCell>
                    <TableCell>Stddev</TableCell>
                    <TableCell>Max</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.statHeader}>
                      Latency
                    </TableCell>
                    <TableCell>{data.latency['p2_5']} ms</TableCell>
                    <TableCell>{data.latency['p50']} ms</TableCell>
                    <TableCell>{data.latency['p97_5']} ms</TableCell>
                    <TableCell>{data.latency['p99']} ms</TableCell>
                    <TableCell>{data.latency['average']} ms</TableCell>
                    <TableCell>{data.latency['stddev']} ms</TableCell>
                    <TableCell>{data.latency['max']} ms</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" className={classes.tableHeader}>
              <label>Volume</label>
              <Tooltip title="Histogram statistics about the amount of requests that were sent per second and the response data throughput per second.">
                <HelpIcon color="primary" className={classes.helpIcon} />
              </Tooltip>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Stat</TableCell>
                    <TableCell>2.5%</TableCell>
                    <TableCell>50%</TableCell>
                    <TableCell>97.5%</TableCell>
                    <TableCell>99%</TableCell>
                    <TableCell>Avg</TableCell>
                    <TableCell>Stddev</TableCell>
                    <TableCell>Max</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.statHeader}>
                      Req/Sec
                    </TableCell>
                    <TableCell>{data.requests['p1']}</TableCell>
                    <TableCell>{data.requests['p2_5']}</TableCell>
                    <TableCell>{data.requests['p50']}</TableCell>
                    <TableCell>{data.requests['p97_5']}</TableCell>
                    <TableCell>{data.requests['average']}</TableCell>
                    <TableCell>{data.requests['stddev']}</TableCell>
                    <TableCell>{data.requests['min']}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.statHeader}>
                      Bytes/Sec
                    </TableCell>
                    <TableCell>{prettyBytes(data.throughput['p1'])}</TableCell>
                    <TableCell>
                      {prettyBytes(data.throughput['p2_5'])}
                    </TableCell>
                    <TableCell>{prettyBytes(data.throughput['p50'])}</TableCell>
                    <TableCell>
                      {prettyBytes(data.throughput['p97_5'])}
                    </TableCell>
                    <TableCell>
                      {prettyBytes(data.throughput['average'])}
                    </TableCell>
                    <TableCell>
                      {prettyBytes(data.throughput['stddev'])}
                    </TableCell>
                    <TableCell>{prettyBytes(data.throughput['min'])}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Accordion>
    </React.Fragment>
  )
}

ResultSet.propTypes = {
  data: T.object
}
