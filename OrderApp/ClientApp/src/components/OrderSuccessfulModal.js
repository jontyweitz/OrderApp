import React, { Component } from 'react';
import { Modal} from 'react-bootstrap';

export default class OrderSuccessfulModal extends Component {

    constructor(props) {
        super(props);       
    }

    render() {

        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Your order has been placed! Leave the rest up to the chefs and our drivers!</p>
                    <button onClick={this.props.handleClose} className="btn btn-primary"> OK </button>
                </Modal.Body>
            </Modal>
        );
    }
}