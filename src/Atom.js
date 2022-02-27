export default function Atom(props) {
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