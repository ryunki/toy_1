import {Nav, Navbar, Container} from 'react-bootstrap';


const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/players">Players</Nav.Link>
            <Nav.Link href="/leaderboard">Leaderboard</Nav.Link>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>
  )
}

export default NavigationBar