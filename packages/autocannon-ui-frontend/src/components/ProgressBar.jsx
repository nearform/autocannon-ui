import React from 'react'

import T from 'prop-types'

import { Box, LinearProgress, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const PREFIX = 'ProgressBar'
const classes = {
  root: `${PREFIX}-root`,
  bar: `${PREFIX}-bar`
}

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  padding: `${theme.spacing(1)} 0px ${theme.spacing(3)} 0px`,

  [`& .${classes.bar}`]: {
    height: '12px',
    borderRadius: '4px'
  }
}))

export default function ProgressBar(props) {
  return (
    <Root>
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box minWidth={35}>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
        <Box width="100%">
          <LinearProgress
            className={classes.bar}
            variant="determinate"
            {...props}
          />
        </Box>
      </Box>
    </Root>
  )
}

ProgressBar.propTypes = {
  value: T.number
}
