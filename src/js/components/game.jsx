
const React = require("react");

const Cell = require("./cell.jsx")

class Game extends React.Component {

	render () {
		const self = this;
		const rows = [];
		const cols = [];
		for (let i=1; i<=self.props.game.rowNumber; i++) {
			rows.push(i);
		}
		for (let i=1; i<=self.props.game.colNumber; i++) {
			cols.push(i);
		}
		return (
			<div className="game">
				<table className="map">
					<tbody>
						{rows.map((rowIndex) => (
							<tr key={rowIndex} id={"row-"+rowIndex}>
								{cols.map((colIndex) => (
									<Cell key={`${rowIndex}-${colIndex}`} row={rowIndex} col={colIndex} cell={self.props.game.cells[`${rowIndex}-${colIndex}`]} onSelect={self.props.actionSelectCell} />
								))}
							</tr>
						))}
					</tbody>
				</table>
				<div className="dashboard">
					<div>Tour : {self.props.game.turn}</div>
					<div>Le joueur <span style={{color:self.props.game.currentPlayer}}>{self.props.game.players[self.props.game.currentPlayer].name}</span> joue</div>
					<div>
						<button onClick={self.props.actionNext}>Fin de tour</button>
					</div>
					<div>{self.props.game.selectedCell ? 'Sélection : '+self.props.game.selectedCell : null}</div>
					<div>
						<button onClick={self.props.actionEndGame}>Quitter</button>
					</div>
				</div>
			</div>
		);
	}
}

module.exports = Game;