import React, { Component } from "react";

class Block extends Component {
	// state = {
	// 	hash: "312312321231",
	// 	previousHash: "fsdfd223423asdfa",
	//   miner: "adsifiuoeoijadfoajig",
	// 	nonce: "",
	// 	timestamp: new Date(),
	// };
	render() {
		return (
			<div className="card">
				<div className="card-header">
					<div className="card-header-title">
						<h1 className="title is-6 mb-0">Block #{this.props.index}</h1>
						{this.props.index === 0 && <span className="subtitle is-6">(Genesis)</span>}
					</div>
					<div className="column">{this.props.block.timestamp.toISOString()}</div>
				</div>
				<div className="card-content">
					<h3 className="subtitle is-6 mb-1">Hash</h3>
					<p className="subtitle is-7">
						<a href="/">{this.props.block.hash}</a>
					</p>
					{/* <h3 className="subtitle is-6 mb-1">Previous block hash</h3>
          <p className="subtitle is-7">
						<a href="/">{this.state.previousHash}</a>
					</p> */}
					<h3 className="subtitle is-6 mb-1">Miner</h3>
					<p className="subtitle is-7">
						<a href="/">{this.props.block.miner}</a>
					</p>
					<button className="button">View</button>
				</div>
			</div>
		);
	}
}

export default Block;
