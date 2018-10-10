import React, { Component } from 'react';

class ListItem extends Component {
  render() {
    return(
      <div>
        {this.props.dataProp.value}
      </div>
    );
  }
}

export default ListItem;