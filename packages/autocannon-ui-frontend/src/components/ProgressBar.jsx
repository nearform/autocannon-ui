import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import T from 'prop-types'

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  bar: {
    height: '10px',
    borderRadius: '5px'
  }
})

export default function ProgressBar(props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
        <Box width="100%" mr={1}>
          <LinearProgress
            className={classes.bar}
            variant="determinate"
            {...props}
          />
        </Box>
      </Box>
    </div>
  )
}

ProgressBar.propTypes = {
  value: T.number
}
