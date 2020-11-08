// Fix "perf death by a thousand cuts"
// Exercise 6 Extra Credit 2

import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

// Extra Credit
// 2. 💯 limit the work consuming components do

// If you open up the React DevTools Profiler and click one of the cells then you’ll notice
// that all the Cells are re-rendering but only the one that was clicked will actually get
// a state update. The re-render was completely unnecessary.

// An alternative solution is to limit the amount of work consuming components have to do
// and make it easier to determine whether a component needs to update. Conceptually, each
// Cell in our example represents a different component you may have in your application.
// Each of those components only cares about a slice of the state and not all of it.
// Unfortunately, even though we’re memoizing the component itself with React.memo, whenever
// we have a state update, each consumer needs to re-render so it can determine whether the
// state update was something that matters to it.

// So what if we make the Cell actually accept a cell prop and then put a middle-man component
// in there that does the actual consuming of useAppState(). We could rename the Cell
// component to CellImpl (Impl is short for “implementation"). And then the "middle-man”
// component could be called Cell (which is the one that we actually expose for use).
// That way if there’s a state update, Cell is re-rendered, and it forwards the cell to
// CellImpl which is memoized and will therefore only re-render when cell changes.

// You may find it easier to just undo all your work so far and start over from scratch to
// implement this.

// Be sure to double-check the experience and make sure your changes are actually improving
// the situation. Sometimes this will help, and other times it doesn’t do much to help and
// only leaves you with a more complex codebase for no reason!

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

function Cell({row, column}) {
  const state = useAppState()
  const cell = state.grid[row][column]

  return <CellImpl row={row} column={column} cell={cell} />
}
Cell = React.memo(Cell)

function CellImpl({row, column, cell}) {
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

CellImpl = React.memo(CellImpl)

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

/*
eslint
  no-func-assign: 0,
*/
