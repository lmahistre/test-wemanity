
const React = require("react");

class Cell extends React.Component {
	render () {
		let style = {
			backgroundColor : null,
		}
		if (this.props.cell.owner === 'red') {
			style.backgroundColor = '#FDD';
		}
		else if (this.props.cell.owner === 'blue') {
			style.backgroundColor = '#DDF';
		}
		return (
			<td id={`cell-${this.props.row}-${this.props.col}`} className="cell" style={style} onClick={this.props.onSelect(`${this.props.row}-${this.props.col}`)}>
				{this.props.cell.armies.map((army, idx) => (
					<div key={idx} className="army" style={{color:army.owner}}>{army.number}</div>
				))}
			</td>
		)
	}
}

module.exports = Cell;
