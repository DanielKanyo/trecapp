import React, { Component } from 'react';

class Footer extends Component {
 render() {
  return (
   <div className="Footer">
    <div>
     Copyright © {new Date().getFullYear()}
    </div>
   </div>
  )
 }
}

export default Footer;