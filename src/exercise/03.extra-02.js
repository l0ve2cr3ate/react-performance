// React.memo for reducing unnecessary re-renders
// Exercise 3 Extra Credit 2

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

// 2. 💯 pass only primitive values

// Wouldn’t it be even better to not have to provide our custom memoization comparator
// function and still get the perf gains? Definitely! So an alternative approach is to
// pass the pre-computed values for isSelected and isHighlighted to our ListItem.
// That way they are primitive values and we can take advantage of React’s built-in
// comparison function and remove ours altogether.

// The additional benefit to this is when you select an item, only the selected item needs
// a re-render.

// So for this extra credit, try to accept an isSelected and isHighlighted prop to ListItem
// so you don’t have to pass the frequently changing values for selectedItem and
// highlightedIndex.

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
          isSelected={selectedItem?.id === item.id}
          isHighlighted={highlightedIndex === index}
        >
          {item.name}
        </ListItem>
      ))}
    </ul>
  )
}

Menu = React.memo(Menu)

function ListItem({
  getItemProps,
  item,
  index,
  isSelected,
  isHighlighted,
  ...props
}) {
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

ListItem = React.memo(ListItem)

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: allItems, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])
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
