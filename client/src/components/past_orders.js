import React, { Component } from "react";
import Order from "../components/order.js";

export default class PastOrders extends Component {

  render() {
    return(
      <div className = "row">
        {this.props.orders.reverse().map(function(order, key){
          return (
          <Order key={key}
            orderId = {order.orderId}
            status = {order.status}
            contents = {order.contents}
            total_cost = {order.total_cost}
          ></Order>
        )})}
      </div>
    )}
}
