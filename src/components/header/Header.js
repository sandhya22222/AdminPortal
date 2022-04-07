import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { BrandLogo } from "../../constants/media";

import "./header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container fluid className="navbar">
      <Navbar color="primary" dark expand="md" fixed="top" light>
        <NavbarBrand to="/" tag={Link} className="me-auto">
          <img src={BrandLogo} alt="logo" width={80} />
        </NavbarBrand>
        <NavbarToggler
          className="me-2"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto ps-5" navbar>
            <NavItem>
              <NavLink tag={Link} to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/dashboard">
                Dashboard
              </NavLink>
            </NavItem>
            <UncontrolledDropdown inNavbar nav>
              <DropdownToggle caret nav>
                Options
              </DropdownToggle>
              <DropdownMenu end>
                <DropdownItem>Option 1</DropdownItem>
                <DropdownItem>Option 2</DropdownItem>
                <DropdownItem divider />
                <DropdownItem>Reset</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <Nav navbar>
            <NavLink tag={Link} to="/signin">
              Signin
            </NavLink>
          </Nav>
        </Collapse>
      </Navbar>
    </Container>
  );
};

export default Header;
