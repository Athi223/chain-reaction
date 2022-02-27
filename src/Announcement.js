import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

export default function Annoucement(props) {
	const color = [ "Red", "Blue", "Green", "Yellow" ][props.current]
	const [ players, setPlayers ] = useState(2)
	const handlePlayers = (e) => setPlayers(e.target.value)
	let title, body, footer
	switch(props.choice) {
		case "start":
			title = "Create / Join game"
			body = <Form className="d-flex">
				<Form.Control type="number" placeholder="Enter Room ID" />
				<Button variant="success" onClick={props.handleModal()}>Join</Button>
			</Form>
			footer = <Button variant="primary" onClick={props.handleModal(players)}>Create</Button>
			break
		case "players":
			title = "Set the Number of Players"
			body = <Form>
				<h5><Form.Label>Number of Players: {players}</Form.Label></h5>
				<Form.Range onChange={handlePlayers} value={players} min={2} max={4} step={1} />
			</Form>
			footer = <Button onClick={() => props.handleModal(players)} variant="primary">Start</Button>
			break
		case "win":
			title = color + " Won!"
			body = color + " has won the game!"
			footer = <Button onClick={() => window.location.reload()} variant="primary">Restart?</Button>
			break
		default:
			title = ""
	}
	return (
		<Modal show={props.show} onHide={props.handleModal} aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false}>
			<Modal.Header><Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title></Modal.Header>
			<Modal.Body>{body}</Modal.Body>
			<Modal.Footer>{footer}</Modal.Footer>
		</Modal>
	)
}