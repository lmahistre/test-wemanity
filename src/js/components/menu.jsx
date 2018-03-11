
const React = require("react");

class Menu extends React.Component {

	render () {
		return (
			<div>
				<button onClick={this.props.startGame}>Démarrer</button>
			</div>
		);
	}
}

module.exports = Menu;