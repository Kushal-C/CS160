import React, { Component } from "react";
import {Link} from "react-router-dom";

//Takes in a list of properties:
//-Order status
//-List of items containing dictionaries which contain the
//quanitiy of each item ordered, and cost of each item
//-Total price
export default class Order extends Component {

  renderOrder() {
    if(this.props.contents) {
      return (
        this.props.contents.map(function(item, key){
          return(
            <div key={key}>{item.name} x{item.quantity} Cost: ${item.cost.toFixed(2)}</div>
          )
        })
      )
    }
    else {
      return (
        <div>Could not render order</div>
      )
    }
  }

  render() {
    var routingLink = "/dashboard/checkout/view/" + this.props.orderId;
    return (
      <div className="card ml-4" style={{padding:'20px', marginBottom:'20px'}}>
        <div className="card-body" style={{width:'auto'}}>
          <h4 className="card-title">Order - {this.props.orderId}</h4>
          <div className="dropdown-divider" />
          {this.renderOrder()}
          <h5>Total Cost: ${this.props.total_cost}</h5>
          <button className="btn btn-primary"><Link className="text-white" to={routingLink}>View Order</Link></button>
        </div>
      </div>
    );
  }
}
