// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

// Our app has a neat Globe component that shows the user where they are on the globe.
// Cool right? It’s super duper fun.

// But one day our product manager 👨‍💼 came along and said that users are complaining
// the app is taking too long to load. We’re using several sizeable libraries to have
// the really cool globe, but users only need to load it if they click the “show globe”
// button and loading it ahead of time makes the app load slower.

// So your job as a performance professional is to load the code on-demand so the user
// doesn’t have to wait to see the checkbox.

// For this one, you’ll need to open the final in isolation and open the Chrome DevTools
// Network tab to watch the webpack chunks load when you click "show globe."
// Your objective is to have the network load those same chunks so they’re not in the
// bundle to begin with.

// 💰 Here’s a quick tip: In the Network tab, there’s a dropdown for artificially
// throttling your network speed. It defaults to “Online” but you can change it to “Fast 3G”,
//  “Slow 3G”, etc.

// Also, spend a bit of time playing with the coverage feature of the dev tools (as noted above).

const Globe = React.lazy(() => import('../globe'))

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
        <React.Suspense fallback={<div>Loading...</div>}>
          {showGlobe ? <Globe /> : null}
        </React.Suspense>
      </div>
    </div>
  )
}

export default App



