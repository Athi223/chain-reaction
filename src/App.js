import { Button, Card, Form, Modal, Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

export default function App() {
	const [ modal, setModal ] = useState(false)
	const [ choice, setChoice ] = useState(true)
	const [ current, setCurrent ] = useState(0)
	const [ alive, setAlive ] = useState([ 0, 0, 0, 0 ])			// 0 - dead (or disable), 1 - alive, 2 - first move
	const [ rows, setRows ] = useState(Array(10).fill(0).map((_, i) => Array(6).fill(0).map((_, j) => ({ size: 0, color: -1 }))))
	const borders = [ "border-danger", "border-primary", "border-success", "border-warning" ]
	useEffect(() => {
		setModal(true)
	}, [])
	const handleModal = (players) => {
		if(players) {
			setAlive(_alive => {
				while(players--) {
					_alive[players] = 2
				}
				return _alive
			})
		}
		setModal(false)
	}
	const handleClick = (e) => {
		const row = e.target.parentElement.rowIndex
		const column = e.target.cellIndex
		reaction(row, column, true)
	}
	// row => row on board, column => column on board, triggered => true if clicked, false if chained
	const reaction = (row, column, triggered) => {
		let _rows = [...rows]
		if(triggered && _rows[row][column].color !== -1 && _rows[row][column].color !== current) return
		if(_rows[row][column].size + 1 === 4) {
			// explode
			_rows[row][column] = { size: 0, color: -1 }
			chain(row, column)
		}
		else if(_rows[row][column].size + 1 === 3 && (row === 0 || row === 9 || column === 0 || column === 5)) {
			// explode
			_rows[row][column] = { size: 0, color: -1 }
			chain(row, column)
		}
		else if(_rows[row][column].size + 1 === 2 && ((row === 0 && column === 0) || (row === 0 && column === 5) || (row === 9 && column === 0) || (row === 9 && column === 5) )) {
			// explode
			_rows[row][column] = { size: 0, color: -1 }
			chain(row, column)
		}
		else {
			_rows[row][column] = { size: _rows[row][column].size + 1, color: current }
			setRows(_rows)	
		}
		if(triggered) {
			if(alive[current] === 2) setAlive(_alive => {
				_alive[current] = 1
				return _alive
			})
			setCurrent(_current => {
				do {
					_current = (_current + 1) % 4
				}
				while(!alive[_current])
				return _current
			})
		}
		if(alive.reduce((count, _alive) => count += (_alive === 2), 0) === 0) checkAlive()
	}
	const chain = (row, column) => {
		if(row !== 0) {
			reaction(row - 1, column, false)
		}
		if(row !== 9) {
			reaction(row + 1, column, false)
		}
		if(column !== 0) {
			reaction(row, column - 1, false)
		}
		if(column !== 5) {
			reaction(row, column + 1, false)
		}
	}
	const checkAlive = () => {
		let counts = [ 0, 0, 0, 0 ]														// [ red, blue, green, yellow ]
		rows.forEach(row => {
			row.forEach(cell => ++counts[cell.color])
		})
		setAlive(_alive => {
			counts.forEach((count, i) => _alive[i] = (count ? 1 : 0))					// Set to 1 if count > 0 else 0
			return _alive
		})
		if(counts.filter(count => count).length === 1) {
			setChoice(false)
			setModal(true)
		}
	}
	return (
		<div className='App-header'>
			<Card>
				<Card.Body>
					<Card.Title className="text-center">Chain Reaction</Card.Title>
					<Card.Body>
						<Table bordered className={borders[current]}>
							<tbody>
								{rows.map((row, i) => <Row key={i} row={row} handleClick={handleClick} />)}
							</tbody>
						</Table>
					</Card.Body>
				</Card.Body>
			</Card>
			<Annoucement show={modal} handleModal={handleModal} choice={choice} current={current} />
		</div>
	)
}

function Row(props) {
	return (
		<tr>
			{props.row.map((cell, i) => <Cell key={i} cell={cell} handleClick={props.handleClick} />)}
		</tr>
	)
}

function Cell(props) {
	return (
		<td className="border-2" onClick={props.handleClick}>
			<Atom size={props.cell.size} color={props.cell.color} />
		</td>
	)
}

function Atom(props) {
	const color = ["red", "blue", "green", "yellow"][props.color]
	if(props.size === 0) {
		return null
	}
	if(props.size === 1) {
		return (
			<svg viewBox="0 0 70 70" preserveAspectRatio="xMinYMin meet">
				<defs>
					<radialGradient id={"gradient" + color} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
					<stop offset="10%" style={{ stopColor: "#fff" }} />
					<stop offset="90%" style={{ stopColor: color }} />
					</radialGradient>
				</defs>

				<circle r="25%" cx="50%" cy="50%" fill={"url(#gradient" + color + ")"} />
			</svg>
		)
	}
	if(props.size === 2) {
		return (
			<svg viewBox="0 0 70 70" preserveAspectRatio="xMinYMin meet">
				<defs>
					<radialGradient id={"gradient" + color} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
					<stop offset="10%" style={{ stopColor: "#fff" }} />
					<stop offset="90%" style={{ stopColor: color }} />
					</radialGradient>
				</defs>

				<circle r="20%" cx="25%" cy="50%" fill={"url(#gradient" + color + ")"} />
				<circle r="20%" cx="75%" cy="50%" fill={"url(#gradient" + color + ")"} />
			</svg>
		)
	}
	if(props.size === 3) {
		return (
			<svg viewBox="0 0 70 70" preserveAspectRatio="xMinYMin meet">
				<defs>
					<radialGradient id={"gradient" + color} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
					<stop offset="10%" style={{ stopColor: "#fff" }} />
					<stop offset="90%" style={{ stopColor: color }} />
					</radialGradient>
				</defs>

				<circle r="20%" cx="25%" cy="30%" fill={"url(#gradient" + color + ")"} />
				<circle r="20%" cx="75%" cy="30%" fill={"url(#gradient" + color + ")"} />
				<circle r="20%" cx="50%" cy="70%" fill={"url(#gradient" + color + ")"} />
			</svg>
		)
	}
}

function Annoucement(props) {
	const color = [ "Red", "Blue", "Green", "Yellow" ][props.current]
	const [ players, setPlayers ] = useState(2)
	const handlePlayers = (e) => setPlayers(e.target.value)
	return (
		<Modal show={props.show} onHide={props.handleModal} aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false}>
		<Modal.Header>
			<Modal.Title id="contained-modal-title-vcenter">{props.choice ? "Set the Number of Players" : color + " Won!"}</Modal.Title>
		</Modal.Header>
		<Modal.Body>
		{ props.choice ?
			<Form>
				<h5><Form.Label>Number of Players: {players}</Form.Label></h5>
				<Form.Range onChange={handlePlayers} value={players} min={2} max={4} step={1} />
			</Form> :
			color + " has won the game!"
		}
		</Modal.Body>
		<Modal.Footer>
		{
			props.choice ?
			<Button onClick={() => props.handleModal(players)} variant="primary">Start</Button> :
			<Button onClick={() => window.location.reload()} variant="secondary">Restart</Button>
		}
		</Modal.Footer>
		</Modal>
	)
}