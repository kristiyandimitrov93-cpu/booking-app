import { Container, Navbar } from 'react-bootstrap'
import './App.css'
import { BookingForm } from './components/BookingForm'
import { BookingsView } from './components/BookingsView'
import { Calendar } from 'lucide-react'

function App() {

  return (<>
    <Navbar bg="primary" variant="dark" className="mb-4">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center gap-2">
          <Calendar size={24} />
          Bookings Manager
        </Navbar.Brand>
      </Container>
    </Navbar>

    <Container fluid>
      <div className="row g-4 align-items-start">
        <div className="col-12 col-lg-4 col-xl-3">
          <BookingForm />
        </div>

        <div className="col-12 col-lg-8 col-xl-9">
          <BookingsView />
        </div>
      </div>
    </Container>
  </>
  )
}

export default App
