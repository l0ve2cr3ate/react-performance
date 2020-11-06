// Code splitting
// Exercise 1 Extra Credit 2

import * as React from 'react'

// 2. 💯 webpack magic comments

// If you’re using webpack to bundle your application, then you can use webpack magic comments
// to have webpack instruct the browser to prefetch dynamic imports:

// import(/* webpackPrefetch: true */ './some-module.js')
// When webpack sees this comment, it adds this to your document’s head:

// <link rel="prefetch" as="script" href="/static/js/1.chunk.js">
// With this, the browser will automatically load this JavaScript file into the browser
// cache so it’s ready ahead of time.

// The change itself is minimal, but pull up the DevTools to make sure it’s loading
// properly (you’ll need to uncheck the “Disable cache” button to observe any changes).

// Notes
// Another thing which we won’t cover in this workshop, but you should look into later,
// is using the webpackChunkName magic comment which will allow webpack to place common
// modules in the same chunk. This is good for components which you want loaded together
// in the same chunk (to reduce multiple requests for multiple modules which will likely
// be needed together).

// You can play around with this in the src/examples/code-splitting directory.

const loadGlobe = () => import(/* webpackPrefetch: true */ '../globe')
const Globe = React.lazy(loadGlobe)

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
      <label
        onFocus={loadGlobe}
        onMouseOver={loadGlobe}
        style={{marginBottom: '1rem'}}
      >
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
