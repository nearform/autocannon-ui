import autocannon from 'autocannon'

export default function execute(options, cb) {
  const {
    url,
    connections,
    pipelining,
    duration,
    timeout,
    title,
    headers,
    body,
    renderProgressBar,
    renderLatencyTable,
    renderResultsTable
  } = options

  const instance = autocannon(
    {
      url,
      connections,
      pipelining,
      duration,
      timeout,
      title,
      headers,
      body
    },
    cb
  )

  autocannon.track(instance, {
    renderProgressBar,
    renderLatencyTable,
    renderResultsTable
  })

  return instance
}
