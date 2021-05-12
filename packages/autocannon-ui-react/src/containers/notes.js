notes
// function handleResponse(client, statusCode, resBytes, responseTime) {
//   // console.log(`Got response with code ${statusCode} in ${responseTime} milliseconds`)
//   // console.log(`response: ${resBytes.toString()}`)
//   // console.log(`Req made this sec-${client.reqsMadeThisSecond}, Total req-${client.reqsMade}, Rate: ${client.rate}`)
//   // reply.raw.write(`Req made this sec-${client.reqsMadeThisSecond}, Total req-${client.reqsMade}, Rate: ${client.rate}`)
// }


// request.raw.on('close', () => {
//     console.log("close event received");
//     reply.status(200).send("Closed")
//   })


// renderlist() {

//     if (!this.props.links) {
//         return <div>Select a link to get started.</div>;
//       }

//     return this.props.links.map(link => {
//         return (
//             <li key={link}>
//                 {link}
//             </li>
//         )
//     })
// }



//     <div>
//     <label>Topic</label>
//     <select value={topic} onChange={this.handleTopicChange}>
//         <option value="react">React</option>
//         <option value="angular">Angular</option>
//         <option value="vue">Vue</option>
//     </select>
// </div>


useEffect(() => {
  document.title = `You clicked ${count} times`;
});