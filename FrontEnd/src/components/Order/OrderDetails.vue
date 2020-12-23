<template>
    <div id="details">
        <div id="order-info-container">
            <div id="orderer-info">
                <div class="display-customer-info" id="order-id">
                    Order's ID
                </div>
                <div class="display-customer-info" id="customer-name">
                    Customer's name
                </div>
                <div class="display-customer-info" id="customer-phone-number">
                    Phone number
                </div>
                <div class="display-customer-info" id="customer-address">
                    Address
                </div>
            </div>
            <div id="order-about">
                <div id="detail-status-container-in-process">
                    <div id="detail-order-shop-name">
                        Banana Shop
                    </div>
                    <div id="detail-order-status">
                        In process
                    </div>
                </div>
                <div id="detail-date-container">
                    <div class="row">
                        <div class="row-name">
                            Date
                        </div>
                        <div class="row-content" id="display-order-date">
                            31/12/2020
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-name">
                            Total price
                        </div>
                        <div class="row-content" id="display-order-total-price">
                            $68.00
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-name">
                            Delivery
                        </div>
                        <div class="row-content" id="display-order-delivery">
                            $1.00
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-name">
                            Coupon
                        </div>
                        <div class="row-content" id="display-order-coupon">
                            n/a
                        </div>
                    </div>
                    <div class="row">
                        <div class="row-name" id="display-order-final-price">
                            Total
                        </div>
                        <div class="row-content" id="display-order-total">
                            $69.00
                        </div>
                    </div>
                </div>
            </div>
            <div id="order-items-list">
                <div class="item-row">
                    <div class="item-row-img"></div>
                    <div class="item-row-name" id="item-name">Name</div>
                    <div class="item-row-quantity">
                        <span>Quantity: </span>
                        <span id="item-quantity">10</span>
                    </div>
                    <div class="item-row-total" id="item-total">$67.00</div>
                </div>
                <div class="item-row">
                    <div class="item-row-img"></div>
                    <div class="item-row-name" id="item-name">Name</div>
                    <div class="item-row-quantity">
                        <span>Quantity: </span>
                        <span id="item-quantity">5</span>
                    </div>
                    <div class="item-row-total" id="item-total">$1.00</div>
                </div>
            </div>
        </div>
    </div>
</template>