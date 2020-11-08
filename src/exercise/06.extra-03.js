// Fix "perf death by a thousand cuts"
// Exercise 6 Extra Credit 3

import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

// Extra Credit
// 3. 💯 write an HOC to get a slice of app state

// The previous extra credit could be made more generic via a Higher Order Component.
// If you make it this far, try to write a higher order component (I called it
// withStateSlice) to make it easier for us to do the previous optimization in more places.

// NOTE: this is effectively what react-redux’s connect higher order component does.

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()
const DogContext = React.createContext()

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_GRID_CELL': {
      return {...state, grid: updateGridCellState(state.grid, action)}
    }
    case 'UPDATE_GRID': {
      return {...state, grid: updateGridState(state.grid)}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function dogReducer(state, action) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    grid: initialGrid,
  })
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

function DogProvider({children}) {
  const [state, dispatch] = React.useReducer(dogReducer, {
    dogName: '',
  })
  const value = [state, dispatch]
  return <DogContext.Provider value={value}>{children}</DogContext.Provider>
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within the AppProvider')
  }
  return context
}

function useDogState() {
  const context = React.useContext(DogContext)
  if (!context) {
    throw new Error('useDogState must be used within the DogProvider')
  }
  return context
}

function Grid() {
  const dispatch = useAppDispatch()
  const [rows, setRows] = useDebouncedState(50)
  const [columns, setColumns] = useDebouncedState(50)
  const updateGridData = () => dispatch({type: 'UPDATE_GRID'})
  return (
    <AppGrid
      onUpdateGrid={updateGridData}
      rows={rows}
      handleRowsChange={setRows}
      columns={columns}
      handleColumnsChange={setColumns}
      Cell={Cell}
    />
  )
}
Grid = React.memo(Grid)

const withStateSlice = (Component, slice) => {
  const MemoizedComponent = React.memo(Component)

  const Wrapper = (props, ref) => {
    const state = useAppState()
    const cell = slice(state, props)

    return <MemoizedComponent state={cell} ref={ref} {...props} />
  }

  Wrapper.displayName = `withStateSlice(${
    Component.displayName || Component.Name
  })`

  return React.memo(React.forwardRef(Wrapper))
}

function Cell({state: cell, row, column}) {
  const dispatch = useAppDispatch()
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}
Cell = withStateSlice(Cell, (state, {row, column}) => state.grid[row][column])

function DogNameInput() {
  const [state, dispatch] = useDogState()

  const {dogName} = state

  function handleChange(event) {
    const newDogName = event.target.value

    dispatch({type: 'TYPED_IN_DOG_INPUT', dogName: newDogName})
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="dogName">Dog Name</label>
      <input
        value={dogName}
        onChange={handleChange}
        id="dogName"
        placeholder="Toto"
      />
      {dogName ? (
        <div>
          <strong>{dogName}</strong>, I've a feeling we're not in Kansas anymore
        </div>
      ) : null}
    </form>
  )
}
function App() {
  const forceRerender = useForceRerender()
  return (
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <DogProvider>
          <DogNameInput />
        </DogProvider>
        <AppProvider>
          <Grid />
        </AppProvider>
      </div>
    </div>
  )
}

export default App
