// useMemo for expensive calculations
// Exercise 2 Extra Credit 1 and Extra Credit 2

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

// Extra Credit
// 1. 💯 React Production Mode

// When doing this kind of profile measuring (to determine how slow something really is),
// it’s very important that you make sure that the code you’re profiling is the same code
// your users will run. React has a LOT of stuff it does in development mode to make your
// development experience good, but that slows down React considerably.

// So for this, you’ll need to run the app in production mode. To do this, you need to run:

// npm run build
// npm run serve
// Then open up the app on the port it shows (will probably be http://localhost:5000,
// and it’ll also likely be copied to your clipboard). Then run all your profiling on that.
// Compare it to before. MUCH faster right!?

// 2. 💯 Put getItems into a Web Worker

// Warning, this one’s really cool, but kinda tricky… Also, the intent isn’t necessarily
// for you to learn web workers, but just to expose you to a good use case for them.
// You can get started learning about web workers here:
// https://kentcdodds.com/blog/speed-up-your-app-with-web-workers

// It’s awesome that we reduced how often we have to call getItems, unfortunately,
// on low-powered devices, getItems is still quite slow when it actually does need to
// run and we’d like to speed it up. So the product manager 👨‍💼 decided that we need to
// ditch match-sorter in favor of a simple string includes because the experience is not
// fast enough (even though match-sorter does provide a much superior UX). “No!” You argue.
//  “We must have the better UX!” There may be ways to optimize match-sorter itself, but
// let’s try throwing this all into a web worker instead…

// Since you’ve got some extra time, update the import from import {getItems}
// from '../filter-cities' to import {getItems} from '../workerized-filter-cities'
// and then you need to handle the fact that getItems is asynchronous.
// (💰 You don’t need to make many changes, and all of your changes will be in your exercise
//  file).

// Because working with web workers is asynchronous, you’ll probably want to use the useAsync
//  utility found in src/utils.js (💰 take a peak. It has an example for how to use it).

// Note also: For this one, to really get a sense of the performance improvements,
// you’ll want to run the DevTools profiler on the production build of the app.
// Run npm run build and npm run serve. Remember that you’ll need to rerun the build
// every time you make a change.

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
}) {
  return (
    <ul {...getMenuProps()}>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          selectedItem={selectedItem}
          highlightedIndex={highlightedIndex}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  selectedItem,
  highlightedIndex,
  ...props
}) {
  const isSelected = selectedItem?.id === item.id
  const isHighlighted = highlightedIndex === index
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          fontWeight: isSelected ? 'bold' : 'normal',
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const initialState = {status: 'pending', data: []}
  const {data: allItems, run} = useAsync(initialState)

  React.useEffect(() => {
    run(getItems(inputValue))
  }, [run, inputValue])

  const items = allItems.slice(0, 100)

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
        />
      </div>
    </div>
  )
}

export default App
