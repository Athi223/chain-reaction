import { useEffect, useState } from 'react'
import { Card, Table } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

// Import Game components
import Annoucement from './Announcement'
import Row from './Row'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get } from "firebase/database"

import firebaseConfig from './credentials'
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function App() {
	const [ modal, setModal ] = useState(false)
	const [ choice, setChoice ] = useState("players")
	const [ current, setCurrent ] = useState(0)
	const [ alive, setAlive ] = useState([ 0, 0, 0, 0 ])			// 0 - dead (or disable), 1 - alive, 2 - first move
	const [ rows, setRows ] = useState(Array(10).fill(0).map((_, i) => Array(6).fill(0).map((_, j) => ({ size: 0, color: -1 }))))
	const borders = [ "border-danger", "border-primary", "border-success", "border-warning" ]
	useEffect(() => {
		setModal(true)
	}, [])
	useEffect(() => {
		set(ref(database, 'rooms/' + 1), {
			current: current,
			board: rows,
		})
		get(ref(database, 'rooms/' + 1)).then(snapshot => {
			if(snapshot.exists()) {
				console.log(snapshot.val())
			}
		})
	}, [ current, rows ])
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
			setChoice("win")
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
