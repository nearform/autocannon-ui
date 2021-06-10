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
  Tooltip,
  AccordionDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles'
import T from 'prop-types'
import prettyBytes from 'pretty-bytes'
import HelpIcon from '@material-ui/icons/Help'

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    padding: theme.spacing(3)
  },
  cardContainer: {
    padding: theme.spacing(3)
  },
  helpIcon: {
    fontSize: 'medium',
    cursor: 'default',
    marginLeft: theme.spacing(1)
  },
  tableHeader: {
    padding: theme.spacing(2)
  },
  statHeader: {
    fontWeight: 'bold'
  },
  httpRowDetails:{
    width: '15%'
  },
  summary: {
    '&.Mui-expanded': {
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  }
}))

export default function ResultSet({ data }) {
  const classes = useStyles()

  return (
    <React.Fragment>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.summary}
          data-id="result-accordion"
        >
          <Typography>{new Date(data.start).toLocaleString()}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container className={classes.cardContainer}>
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
                      <TableCell>
                        {prettyBytes(data.throughput['p1'])}
                      </TableCell>
                      <TableCell>
                        {prettyBytes(data.throughput['p2_5'])}
                      </TableCell>
                      <TableCell>
                        {prettyBytes(data.throughput['p50'])}
                      </TableCell>
                      <TableCell>
                        {prettyBytes(data.throughput['p97_5'])}
                      </TableCell>
                      <TableCell>
                        {prettyBytes(data.throughput['average'])}
                      </TableCell>
                      <TableCell>
                        {prettyBytes(data.throughput['stddev'])}
                      </TableCell>
                      <TableCell>
                        {prettyBytes(data.throughput['min'])}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.tableHeader}>
                <label>HTTP Statuses</label>
                <Tooltip title="Histogram statistics about HTTP Statuses count">
                  <HelpIcon color="primary" className={classes.helpIcon} />
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Errors</TableCell>
                      <TableCell>Timeouts</TableCell>
                      <TableCell>Mismatches</TableCell>
                      <TableCell>Resets</TableCell>
                      <TableCell>1xx</TableCell>
                      <TableCell>2xx</TableCell>
                      <TableCell>3xx</TableCell>
                      <TableCell>4xx</TableCell>
                      <TableCell>5xx</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.statHeader}>
                        Count
                      </TableCell>
                      <TableCell>{data.errors}</TableCell>
                      <TableCell>{data.timeouts}</TableCell>
                      <TableCell>{data.mismatches}</TableCell>
                      <TableCell>{data.resets}</TableCell>
                      <TableCell>{data['1xx']}</TableCell>
                      <TableCell>{data['2xx']}</TableCell>
                      <TableCell>{data['3xx']}</TableCell>
                      <TableCell>{data['4xx']}</TableCell>
                      <TableCell>{data['5xx']}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.tableHeader}>
                <label>HTTP Statuses Details</label>
                <Tooltip title="Histogram statistics about HTTP Statuses detail">
                  <HelpIcon color="primary" className={classes.helpIcon} />
                </Tooltip>
              </Typography>
            </Grid>
            <Grid item xs={12} >
              <TableContainer component={Paper} align={'left'} >
                <Table className={classes.table}>
                  <TableHead>
                  <TableRow>
                      <TableCell className={classes.httpRowDetails}>HTTP Status</TableCell>
                      {Object.keys(data.statusCodeStats).map((option) => 
                       <TableCell key={option}>{option}</TableCell>)
                      }
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.statHeader}>
                        Count
                      </TableCell>
                      {Object.keys(data.statusCodeStats).map((option) => 
                       <TableCell key={option}>{data.statusCodeStats[option].count}</TableCell>)
                      }
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  )
}

ResultSet.propTypes = {
  data: T.object
}
