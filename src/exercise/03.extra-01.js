// React.memo for reducing unnecessary re-renders
// Exercise 3 Extra Credit 1

import * as React from 'react'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

// Extra Credit
// 1. 💯 Use a custom comparator function

// You’ll notice that as you hover over the elements in the list (or click the input and
// press the down and up arrow) the highlightedIndex changes. This prop changes for all
// the ListItem components, but it doesn’t mean that they all need DOM updates. The only
// ListItems that need a DOM update are 1) the old highlighted item, and 2) the new
// highlighted item.

// Luckily for us, React.memo accepts a second argument which is a custom compare function
// that allows us to compare the props and return true if rendering the component again is
// unnecessary and false if it is necessary.

// See if you can figure out how to use that function to make it so changing the highlighted
// index only re-renders the components that need the change.

// NOTE: You can do the same for selectedItem, though that one may be tricker to test and
// I tried it and couldn’t get it to work 😅 I spent 20 minutes on it before giving up!
// Maybe you can figure it out though. This is why these are OPTIMIZATIONS and not to be
// applied in every case. They’re hard to get right and easy to mess up and create bugs!

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

Menu = React.memo(Menu)

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

ListItem = React.memo(ListItem, (prevProps, nextProps) => {
  if (prevProps.getItemProps !== nextProps.getItemsProps) {
    return false
  }
  if (prevProps.item !== nextProps.item) {
    return false
  }
  if (prevProps.index !== nextProps.index) {
    return false
  }
  if (prevProps.selectedItem !== nextProps.selectedItem) {
    return false
  }

  // ListItems that need a DOM update are 1) the old highlighted item, and 2) the new
  // highlighted item.
  if (prevProps.highlightedIndex !== nextProps.highlightedIndex) {
    const oldHighlightedItem = prevProps.highlightedIndex === prevProps.index
    const newHightlightedItem = nextProps.highlightedIndex === nextProps.index
    return oldHighlightedItem === newHightlightedItem
  }

  return true
})

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
