import Atom from './Atom'

export default function Cell(props) {
	return (
		<td className="border-2" onClick={props.handleClick}>
			<Atom size={props.cell.size} color={props.cell.color} />
		</td>
	)
}
