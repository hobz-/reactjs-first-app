

var React = require('react');
var ReactDOM = require('react-dom');
var Grid = require('react-bootstrap').Grid;
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var FormControl = require('react-bootstrap').FormControl;
var Image = require('react-bootstrap').Image;
var Button = require('react-bootstrap').Button;



var ProductPage = React.createClass({
	render: function() {
		return (
			<Grid>
				<ProductImage />
				<ProductTable />
			</Grid>
		);
	}
});

var ProductTable = React.createClass({
	getInitialState: function() {
		return ({isSettled: false,
				 isValid: false,
				 flashMsg: ""})
	},
	handleSettle: function() {
		if (this.state.isValid) {
			console.log(this.state);
			this.setState({isSettled: true,
						   flashMsg: ""});
		}
		else
			this.setState({flashMsg: "Invalid Form Inputs"})
	},
	isTableValid: function(rowState) {
		var invalidForm = 0;
		for (var prop in rowState) {
			if (rowState[prop] < 0 || isNaN(rowState[prop]))
				invalidForm++;
		};
		if (invalidForm===0)
			this.setState({isValid: true});
		else 
			this.setState({isValid: false});
	},
	render: function() {
		return (
				<Col sm={10} md={10}>
		 			<Row className="show-grid">
		  				<Col sm={1} md={1}></Col>
		  				<Col sm={1} md={1} style={{textAlign: 'center'}}>Price</Col>
		 				<Col sm={1} md={1} style={{textAlign: 'center'}}>Count In</Col>
						<Col sm={1} md={1} style={{textAlign: 'center'}}>Add</Col>
						<Col sm={1} md={1} style={{textAlign: 'center'}}>Total In</Col>
						<Col sm={1} md={1} style={{textAlign: 'center'}}>Comp</Col>
						<Col sm={1} md={1} style={{textAlign: 'center'}}>Count Out</Col>
						<Col sm={1} md={1} style={{textAlign: 'center'}}>Total Sold</Col>
						<Col sm={1} md={1} style={{textAlign: 'center'}}>Gross</Col>
					</Row>
					<ProductRow 
						rowName="Large Poster"
						price="10"
						isSettled={this.state.isSettled}
						isValid={this.isTableValid}
					/>
					<Row className="show-grid">
						<Col sm={4} md={4}></Col>
						<Col sm={4} md={4}><FlashMsg msg={this.state.flashMsg} /></Col>
						<Col sm={1} md={1}><SettleButton handleClick={this.handleSettle} /></Col>
					</Row>
				</Col>
		);
	}
});

var ProductImage = React.createClass({
	render: function () {
		return (
			<Col sm={2} md={2}>
				<Image src="app/bsb_poster.jpg" responsive></Image>
			</Col>
		);
	}
});

var FlashMsg = React.createClass({
	render: function() {
		return (<div style={{
				textAlign: 'right',
				color:'red',
				padding: '10px'
			}}
			>{this.props.msg}</div>);
	}
});

var ProductRow = React.createClass({
 getInitialState: function() {
 	return ({
 		price: this.props.price,
		countIn: 12,
		add: 0,
		totalIn: 12,
		comp: 0,
		countOut: 5,
		totalOut: 7,
	});
 },
 onUpdate: function(obj) {
 	var productState = this.state;

 	for (var prop in obj) {
 		productState[prop] = obj[prop];
 	};

	var totalIn = parseInt(productState.countIn) + parseInt(productState.add);
	if (parseInt(totalIn))
		productState['totalIn'] = totalIn;

	var totalOut = parseInt(totalIn) - parseInt(productState.countOut) - parseInt(productState.comp);
	if (parseInt(totalOut))
		productState['totalOut'] = totalOut;

	this.setState(productState); 
	this.props.isValid(this.state);
 },
 render: function() {
	return (
			<Row className="show-grid">
				<Col sm={1} md={1}>{this.props.rowName}</Col>
				<Col sm={1} md={1} style={{verticalAlign: 'middle', textAlign: 'center'}}>{"$" + parseFloat(this.props.price).toFixed(2)}</Col>
	 			<Col sm={1} md={1}>
					<FormField
						value={this.state.countIn}
						type={"countIn"}
						onUpdate={this.onUpdate}
						isDisabled={this.props.isSettled}
					/>
				</Col>
				<Col sm={1} md={1}>
					<FormField
						value={this.state.add}
						type={"add"}
						onUpdate={this.onUpdate}
						isDisabled={this.props.isSettled}
					/>
				</Col>
				<Col sm={1} md={1}>
					<TotalDiv
						value={this.state.totalIn}
					/>
				</Col>
				<Col sm={1} md={1}>
					<FormField
						value={this.state.comp}
						type={"comp"}
						onUpdate={this.onUpdate}
						isDisabled={this.props.isSettled}
					/>
				</Col>
				<Col sm={1} md={1}>
					<FormField
						value={this.state.countOut}
						type={"countOut"}
						onUpdate={this.onUpdate}
						isDisabled={this.props.isSettled}
					/>
				</Col>
				<Col sm={1} md={1}>
					<TotalDiv
						value={this.state.totalOut}
					/>
				</Col>
				<Col sm={1} md={1} style={{verticalAlign:'middle', textAlign:'center'}}>{"$" + parseFloat(this.state.totalOut*this.props.price).toFixed(2)}</Col>
			</Row>
	);
 }
});

var FormField = React.createClass({
	getInitialState: function() {
		return {value: this.props.value}
	},
	handleChange: function(event) {
		var obj = {}
		if (this.isValid(event.target.value)) {
			obj[this.props.type] = event.target.value;
			this.setState({value: event.target.value});
			this.props.onUpdate(obj);
		}
	},
	isValid: function(input) {
		if (input === "" || (!isNaN(parseInt(input)) && input % 1 === 0))
			return true;
		else
			return false;
	},
	render: function() {
		return(
			<FormControl
			type="text"
			disabled={this.props.isDisabled ? true : false}
			value={this.state.value}
			onChange={this.handleChange}
			/>
		);
	}
});
var TotalDiv = React.createClass({
	render: function() {
		return(
			<div style={{
				display: 'inline-block', 
				textAlign: 'center',
				verticalAlign: 'middle',
				width: '100%',
				padding: '10px'
			}}
			>{this.props.value}
			</div>
		);
	}
});

var SettleButton = React.createClass({
	getInitialState: function() {
		return {settled: false};
	},
	render: function() {
		return(
			<Button bsStyle="info" onClick={this.props.handleClick}>SETTLE</Button>
		);
	}
});

ReactDOM.render(
 	<ProductPage />,
 	document.getElementById('example')
);