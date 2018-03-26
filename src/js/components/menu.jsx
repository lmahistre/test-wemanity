
const React = require("react");

class Menu extends React.Component {

	startGame () {
		this.props.startGame({
			rowNumber : document.forms['new-game'].rowNumber.value,
			colNumber : document.forms['new-game'].colNumber.value,
		});
	}


	render () {
		return (
			<div>
				<form name="new-game">
					<div className="form-row">
						<label>{"Lignes :"}</label>
						<input type="number" min="2" max="10" step="1" defaultValue="3" name="rowNumber" />
					</div>
					<div className="form-row">
						<label>{"Colonnes :"}</label>
						<input type="number" min="2" max="10" step="1" defaultValue="3" name="colNumber" />
					</div>
					<div className="form-row">
						<button onClick={this.startGame.bind(this)}>Démarrer</button>
					</div>
				</form>
			</div>
		);
	}
}

module.exports = Menu;