import React, {Component} from "react";
import betImage from './images/bet.png';
import { Container, Nav, NavDropdown } from 'react-bootstrap';
import NavbarB from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";

class Navbar extends Component{
    render(){
        return (
            <NavbarB bg="light" expand="lg" variant="light">
                <Container>
                    <NavbarB.Brand href="#home">
                    <img
                        alt=""
                        src={betImage}
                        width="50"
                        height="30"
                        className="d-inline-block align-top"
                    />
                    Bet
                    </NavbarB.Brand>
                    <NavbarB.Toggle aria-controls="basic-navbar-nav" />
                    <NavbarB.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {/* <Nav.Link href="/games">Games</Nav.Link>
                        <Nav.Link href="/staking">Staking</Nav.Link> */}
                        <Link to="/games">Games</Link>
                        <Link to="/stake">Stake</Link>
                        {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown> */}
                    </Nav>
                    </NavbarB.Collapse>
                </Container>
            </NavbarB>
        )
    }
}

export default Navbar;