import React, { useState, useCallback } from 'react'
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
  AccordionDetails,
  Checkbox,
  Box
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
  httpRowDetails: {
    width: '15%'
  },
  summary: {
    '&.Mui-expanded': {
      borderBottom: `1px solid ${theme.palette.divider}`,

      '& > .MuiAccordionSummary-content': {
        margin: '12px 0px'
      }
    }
  },
  accordionHeader: {
    lineHeight: 2.5
  },
  indexText: {
    marginRight: 12
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  parametersItem: {
    display: 'flex',
    width: '100%',
    padding: '0px 16px 16px 16px'
  },
  itemContainer: {
    width: '33.33%',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 200,
    marginLeft: 8,
    marginRight: 8
  },
  wrappedText: {
    overflow: 'auto',
    overflowWrap: 'anywhere'
  },
  boldText: {
    fontWeight: 'bold'
  }
}))

export default function ResultSet({ data, onChangeSelection }) {
  const classes = useStyles()

  const [isSelected, setIsSelected] = useState(false)

  const onSelectHandler = useCallback(
    e => {
      e.stopPropagation()
      onChangeSelection(data, !isSelected)
      setIsSelected(!isSelected)
    },
    [onChangeSelection, data, isSelected]
  )

  return (
    <React.Fragment>
      {data && (
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classes.summary}
            data-id="result-accordion"
          >
            <Checkbox
              color="primary"
              checked={isSelected}
              onClick={onSelectHandler}
              data-testid="result-checkbox"
            />
            <Box className={classes.headerContainer}>
              <Typography className={classes.accordionHeader}>
                <span className={classes.indexText}>{data.resultIndex}</span>
                <span>{data.title || data.url}</span>
              </Typography>
              <Typography className={classes.accordionHeader}>
                {new Date(data.start).toLocaleString()}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h6" className={classes.tableHeader}>
                  <label>Parameters</label>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box className={classes.parametersItem}>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>URL</Typography>
                    <Typography className={classes.wrappedText}>
                      {data.url}
                    </Typography>
                  </Box>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>Method</Typography>
                    <Typography>{data?.options?.method || ''}</Typography>
                  </Box>
                  <Box className={classes.itemContainer}></Box>
                </Box>

                <Box className={classes.parametersItem}>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>
                      Connections
                    </Typography>
                    <Typography>{data.connections}</Typography>
                  </Box>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>
                      Pipelining
                    </Typography>
                    <Typography>{data.pipelining}</Typography>
                  </Box>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>
                      Duration
                    </Typography>
                    <Typography>{data.duration}</Typography>
                  </Box>
                </Box>

                <Box className={classes.parametersItem}>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>
                      Headers
                    </Typography>
                    <Typography className={classes.wrappedText}>
                      {data?.options?.headers || ''}
                    </Typography>
                  </Box>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>Body</Typography>
                    <Typography className={classes.wrappedText}>
                      {data?.options?.body || ''}
                    </Typography>
                  </Box>
                  <Box className={classes.itemContainer}>
                    <Typography className={classes.boldText}>
                      Timeouts
                    </Typography>
                    <Typography>{data.timeouts}</Typography>
                  </Box>
                </Box>
              </Grid>

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
                        <TableCell>Stdev</TableCell>
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
                  <label>Throughput</label>
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
                        <TableCell>1%</TableCell>
                        <TableCell>2.5%</TableCell>
                        <TableCell>50%</TableCell>
                        <TableCell>97.5%</TableCell>
                        <TableCell>Avg</TableCell>
                        <TableCell>Stdev</TableCell>
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
              <Grid item xs={12}>
                <TableContainer component={Paper} align={'left'}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.httpRowDetails}>
                          HTTP Status
                        </TableCell>
                        {Object.keys(data.statusCodeStats).map(option => (
                          <TableCell key={option}>{option}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell className={classes.statHeader}>
                          Count
                        </TableCell>
                        {Object.keys(data.statusCodeStats).map(option => (
                          <TableCell key={option}>
                            {data.statusCodeStats[option].count}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
    </React.Fragment>
  )
}

ResultSet.propTypes = {
  data: T.object.isRequired,
  onChangeSelection: T.func.isRequired
}
