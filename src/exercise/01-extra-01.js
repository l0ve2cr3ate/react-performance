// Code splitting
// Exercise 1 Extra Credit 1

import * as React from 'react'

// Extra Credit
// 1. 💯 eager loading
// So it’s great that the users can get the app loaded faster, but it’s annoying when 99%
// of the time the reason the users are using the app is so they can interact with our
// textarea. We don’t want to have to make them wait first to load the app and then again
// to load the globe. Wouldn’t it be cool if we could have globe start loading as soon as
// the user hovers over the checkbox? So if they mouseOver or focus the <label> for the
// checkbox, we should kick off a dynamic import for the globe module.

// See if you can make that work.

// 💰 Hint: it doesn’t matter how many times you call import('./path-to-module'), webpack
// will only actually load the module once.

const loadGlobe = () => import('../globe')
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
