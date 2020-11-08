// Production performance monitoring
// Exercise 7 Extra Credit 1

import * as React from 'react'
import reportProfile from '../report-profile'
import {unstable_trace as trace} from 'scheduler/tracing'

// Extra Credit
// 1. 💯 use the experimental trace API

// The interactions argument that our onRenderCallback accepts are for tracing specific
// interactions. Interactions like button clicks or HTTP responses, etc. Using this helps
// us answer more specific questions about what’s causing things to be slow.

// Here’s a basic example of how to use this API:

// ...
// import {unstable_trace as trace} from 'scheduler/tracing'
// ...

// function Greeting() {
//   const [greeting, setGreeting] = React.useState()

//   function handleSubmit(event) {
//     event.preventDefault()
//     const name = event.target.elements.name.value
//     trace('form submitted', performance.now(), () => {
//       setGreeting(`Hello ${name}`)
//     })
//   }

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="name">Name:</label>
//         <input id="name" />
//       </form>
//       <div>{greeting}</div>
//     </div>
//   )
// }
// If you render that component within a <React.Profiler /> then when the form is submitted,
// that interaction will be included.

// In this extra credit, add tracing for the click of the counter.

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () =>
    trace('increment click', performance.now(), () => setCount(c => c + 1))
  return <button onClick={increment}>{count}</button>
}

function App() {
  return (
    <div>
      <React.Profiler id="counter" onRender={reportProfile}>
        <div>
          Profiled counter
          <Counter />
        </div>
        <div>
          Unprofiled counter
          <Counter />
        </div>
      </React.Profiler>
    </div>
  )
}

export default App
