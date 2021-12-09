import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
            <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/">PERFECT CITY</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} />
          <Nav navbar>
          <NavItem>
              <NavLink active href="/all">
                ALL
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/rank">
                RANK
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/compare" >
                COMPARE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/search">
                SEARCH
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
