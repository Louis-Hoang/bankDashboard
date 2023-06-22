import React, { Component } from "react";
import ReactDOM from "react-dom";

import { FixedSizeList as List } from "react-window";


const options = [];
for (let i = 0; i < 10000; i = i + 1) {
  options.push({ value: i, label: `Option ${i}` });
}

const height = 50;

class MenuList extends Component {
  render() {
    var { options, children, maxHeight, getValue } = this.props;
    var [value] = getValue();
    var initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length|| 0} //have no children, children.lenght is undefined
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}


export default MenuList
