import React, { useState, useCallback } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'

import DownloadIcon from '@mui/icons-material/Download'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import T from 'prop-types'
import prettyBytes from 'pretty-bytes'
import HelpIcon from '@mui/icons-material/Help'
import { styled } from '@mui/material/styles'

const PREFIX = 'ResultSet'
const classes = {
  table: `${PREFIX}-table`,
  helpIcon: `${PREFIX}-helpIcon`,
  tableHeader: `${PREFIX}-tableHeader`,
  statHeader: `${PREFIX}-statHeader`,
  httpRowDetails: `${PREFIX}-httpRowDetails`,
  summary: `${PREFIX}-summary`,
  accordionHeader: `${PREFIX}-accordionHeader`,
  indexText: `${PREFIX}-indexText`,
  headerContainer: `${PREFIX}-headerContainer`,
  parametersItem: `${PREFIX}-parametersItem`,
  itemContainer: `${PREFIX}-itemContainer`,
  wrappedText: `${PREFIX}-wrappedText`
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.table}`]: {
    minWidth: 650,
    padding: theme.spacing(3)
  },
  [`& .${classes.helpIcon}`]: {
    fontSize: 'medium',
    cursor: 'default',
    marginLeft: theme.spacing(1)
  },
  [`& .${classes.tableHeader}`]: {
    padding: theme.spacing(2)
  },
  [`& .${classes.statHeader}`]: {
    fontWeight: 'bold'
  },
  [`& .${classes.httpRowDetails}`]: {
    width: '15%'
  },
  [`& .${classes.summary}`]: {
    '&.Mui-expanded': {
      borderBottom: `1px solid ${theme.palette.divider}`,

      '& > .MuiAccordionSummary-content': {
        margin: `${theme.spacing(1.5)} 0px`
      }
    }
  },
  [`& .${classes.accordionHeader}`]: {
    lineHeight: 2.5
  },
  [`& .${classes.indexText}`]: {
    marginRight: theme.spacing(1.5)
  },
  [`& .${classes.headerContainer}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    flexGrow: 1,
    alignItems: 'center'
  },
  [`& .${classes.parametersItem}`]: {
    display: 'flex',
    padding: `0px ${theme.spacing(2)} ${theme.spacing(2)} ${theme.spacing(2)}`
  },
  [`& .${classes.itemContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 200,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  [`& .${classes.wrappedText}`]: {
    overflow: 'auto',
    overflowWrap: 'anywhere'
  }
}))

export default function ResultSet({ data, onChangeSelection }) {
  const [isSelected, setIsSelected] = useState(false)

  const onSelectHandler = useCallback(
    e => {
      e.stopPropagation()
      onChangeSelection(data, !isSelected)
      setIsSelected(!isSelected)
    },
    [onChangeSelection, data, isSelected]
  )

  const handleDownload = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `autocannon-result-${data.resultIndex}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  return (
    <Root>
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
                  <span className={classes.indexText}>#{data.resultIndex}</span>
                  <span>{data.title || data.url}</span>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip title="Download results">
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation()
                        handleDownload()
                      }}
                      data-testid="download-result-button"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Typography className={classes.accordionHeader}>
                    {new Date(data.start).toLocaleString()}
                  </Typography>
                </Box>
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
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        URL
                      </Typography>
                      <Typography className={classes.wrappedText}>
                        {data.url}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        Method
                      </Typography>
                      <Typography>{data?.options?.method || ''}</Typography>
                    </Box>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    ></Box>
                  </Box>

                  <Box className={classes.parametersItem}>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        Connections
                      </Typography>
                      <Typography>{data.connections}</Typography>
                    </Box>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        Pipelining
                      </Typography>
                      <Typography>{data.pipelining}</Typography>
                    </Box>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        Duration
                      </Typography>
                      <Typography>{data.duration}</Typography>
                    </Box>
                  </Box>

                  <Box className={classes.parametersItem}>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        Headers
                      </Typography>
                      <Typography className={classes.wrappedText}>
                        {data?.options?.headers || ''}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
                        Body
                      </Typography>
                      <Typography className={classes.wrappedText}>
                        {data?.options?.body || ''}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ width: '100%' }}
                      className={classes.itemContainer}
                    >
                      <Typography className={classes.statHeader}>
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
    </Root>
  )
}

ResultSet.propTypes = {
  data: T.object.isRequired,
  onChangeSelection: T.func.isRequired
}
