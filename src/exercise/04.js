// Window large lists with react-virtual
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useVirtual} from 'react-virtual'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

// 👨‍💼 The product manager noticed that we’re only rendering the top 100 matches and
// they’re frustrated because they like scrolling for eternity. We tried to explain to
// them about React’s reconciliation and commit phases, but they just smiled, gave us a
// high five and said “You’re smart! I’m sure you can do this!”

// So in this exercise, we’ve removed the items.slice(0, 100) and now we’re rendering
// all the items. Even without throttling your CPU, you should notice a serious performance
// problem here any time there’s any render of any kind. Go ahead and try doing some
// profiling if you like, but I think you know what you need to do. You need to window this
// stuff! Run less code, and speed up your component.

// Note that 💰 Marty the Money Bag has done a tiny bit of work for you that’s specific
// to how you integrate Downshift and react-virtual. He’s done a good job documenting what
// he’s done so you can read about the changes he made if you want. 🐨 Kody the Koala will
//  be there to help you know what changes you need to make. Good luck!


const getVirtualRowStyles = ({size, start}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  listRef,
  virtualRows,
  totalHeight,
}) {
  return (
    <ul {...getMenuProps({ref: listRef})}>
      <li style={{height: totalHeight}} />
      {virtualRows.map(({index, size, start}) => {
        const item = items[index]
        if (!item) return null
        return (
          <ListItem
            key={item.id}
            
            getItemProps={getItemProps}
            item={item}
            index={index}
            isSelected={selectedItem?.id === item.id}
            isHighlighted={highlightedIndex === index}
            style={getVirtualRowStyles({size, start})}
          >
            {item.name}
          </ListItem>
        )
      })}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  style,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          ...style,
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: items, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])

  const listRef = React.useRef()

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 10,
  })

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
    scrollIntoView: () => {},
    onHighlightedIndexChange: ({highlightedIndex}) =>
      highlightedIndex !== -1 && rowVirtualizer.scrollToIndex(highlightedIndex),
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
          listRef={listRef}
          virtualRows={rowVirtualizer.virtualItems}
          totalHeight={rowVirtualizer.totalSize}
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
