import React, { Component } from 'react';
import debounce from '../debounce'
import  OrderSuccessfulModal from './OrderSuccessfulModal'

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            searchTerms: undefined,
            loading: false,
            showSucessModal: false,
            cart: {},
            orderCost: 0
        };
    }

    fectResults = debounce(function (searchTerm) {
        this.setState({ ...this.state, loading: true });
        fetch('api/Restaurant/Search?searchTerms=' + searchTerm)
            .then(response => response.json())
            .then(data => {
                this.setState({ ...this.state, searchTerms: searchTerm, results: data, loading: false, });
            });
    }, 500);

    renderResults(results) {
        if (!results || results.length === 0) {
            return <p><em>No Results</em></p>
        }
        else {

            return (
                <div className="row">
                    {this.state.results.map(restaurant => this.renderRestaurant(restaurant))}
                </div>)
        }
    }

    onCheckBoxClick(e, menuItem) {
        var cart = this.state.cart;
        if (e.target.checked) {
            cart[menuItem.id] = menuItem;
            this.setState({ ...this.state, cart: cart, orderCost: orderCost })
        }
        else {
            var cart = this.state.cart;
            delete cart[menuItem.id];
        }
        var orderCost = this.calculateOrderCost();
        this.setState({ ...this.state, cart: cart, orderCost: orderCost })
    }

    calculateOrderCost() {
        var cart = this.state.cart;
        var total = 0;
        Object.keys(cart).forEach(function (key) {
            total += cart[key].price;
        });
        return total;
    }

    renderRestaurant(restaurant) {
        return (
            <div className="col mt-1" key={restaurant.id}>
                <div className="row"><img src={restaurant.logoPath} />{restaurant.name + ' - ' + restaurant.suburb + ' - rated #' + restaurant.rank + ' over all'}</div>
                {restaurant.categories.map(category => {
                    return (
                        <div className="col-11 offset-1" key={restaurant.id + category.name}>
                            <div><b>{category.name}</b>
                                {category.menuItems.map(menuItem => {
                                    return (<div key={menuItem.id}>
                                        <input type="checkbox" id="vehicle1" name={menuItem.id + "CheckBox"} onChange={(e) => this.onCheckBoxClick(e, menuItem)} />
                                        <span className="ml-1">{menuItem.name + ' - R' + menuItem.price}</span></div>)
                                })}
                            </div>
                        </div>)
                })}
            </div>
        )
    }

    handleSearchChange(e) {
        this.fectResults(e.target.value);
    }

    orderClicked() {
        fetch('api/Restaurant/Order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.values(Object.values(this.state.cart)))
        }).then(response => {
            if (response.status !== 200) {
                console.log("Something went wrong")
            }
            else {
                this.setState({ ...this.state, showSucessModal: true })
            }
        })
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderResults(this.state.results)
        return (
            <div className="container">
                <div className="row mt-3" >
                    <div className="col-6 offset-3">
                        <input type="text" className="form-control" placeholder="Search" aria-label="Search" onChange={(e) => this.handleSearchChange(e)} />
                    </div>
                </div>

                {this.state.searchTerms &&
                    (<div className="row mt-1" >
                    <div className="col-6 offset-3">
                        {"Results for '" + this.state.searchTerms + "'"}
                    </div>
                </div>)}

                <div className="row mt-1" >
                    <div className="col-6 offset-3">
                        {contents}
                    </div>
                </div>

                <div className="row mt-1" >
                    <div className="col-6 offset-3">
                        <button onClick={() => this.orderClicked()} disabled={this.state.orderCost === 0}>{"Order - R" + this.state.orderCost}</button>
                    </div>
                </div>
                <OrderSuccessfulModal show={this.state.showSucessModal} handleClose={() => this.setState({ showSucessModal: false })} />
            </div>
        );
    }
}
