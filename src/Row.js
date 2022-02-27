import Cell from './Cell'

export default function Row(props) {
	return (
		<tr>
			{props.row.map((cell, i) => <Cell key={i} cell={cell} handleClick={props.handleClick} />)}
		</tr>
	)
}
