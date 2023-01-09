import './style.css';
import { base } from '../goodsBase';
import { productInCart } from './product';
import { modal } from './modal-window';
import { promo } from './promo';

const cartAmount = document.querySelector('.cart__amoumt');
const main = document.querySelector('main');
const allPrice = document.querySelector('.total-price');

class Cart {
    contents: { [key: string]: number };

    constructor() {
        if (localStorage.getItem('cart')) {
            const itemLocalStorage = localStorage.getItem('cart');
            if (!itemLocalStorage) {
                throw new ReferenceError('Cart not found in local storage');
            } else {
                this.contents = JSON.parse(itemLocalStorage);
            }
        } else {
            this.contents = {};
        }
    }

    public changeCartAmount = () => {
        if (cartAmount != undefined) {
            !this.contents.amount
                ? (cartAmount.innerHTML = '0')
                : (cartAmount.innerHTML = this.contents.amount + '');
        }
    };

    public changeRouteToCart = () => {
        const path = window.location.pathname;
        if (path !== '/cart') {
            const { origin } = new URL(window.location.href);
            console.log(origin);

            const newUrl = new URL(origin + `/cart`);
            console.log(newUrl);
            window.history.pushState({}, '', newUrl);
        }
    };

    public changeTotalPrice = () => {
        if (allPrice != undefined) {
            if (!this.contents.totalPrice) {
                allPrice.innerHTML = '0.00';
            } else {
                if (this.contents.totalPrice >= 1000) {
                    allPrice.innerHTML =
                        `${Math.floor(this.contents.totalPrice / 1000)},${
                            this.contents.totalPrice % 1000
                        }` + '.00';
                    return (
                        `${Math.floor(this.contents.totalPrice / 1000)},${
                            this.contents.totalPrice % 1000
                        }` + '.00'
                    );
                } else {
                    allPrice.innerHTML = this.contents.totalPrice + '.00';
                    return this.contents.totalPrice + '.00';
                }
            }
        }
    };

    public openCart = () => {
        this.changeRouteToCart();
        if (main) {
            main.innerHTML = '';
        }
        let cartConteiner: HTMLDivElement;
        const cardConteinerFromPage =
            document.querySelector('.cart__conteiner');
        if (cardConteinerFromPage) {
            cartConteiner = document.querySelector(
                '.cart__conteiner'
            ) as HTMLDivElement;
            cardConteinerFromPage.innerHTML = '';
        } else {
            cartConteiner = document.createElement('div');
            cartConteiner.classList.add('cart__conteiner');
            main?.append(cartConteiner);
        }

        if (this.contents.amount === 0 || !this.contents.amount) {
            if (main) {
                main.innerHTML = 'Cart is Empty';
            }
        } else {
            for (const key in this.contents) {
                if (key !== 'amount' && key !== 'totalPrice') {
                    const product = base.products.find(
                        (elem) => elem.id == +key
                    );
                    const productAmount = this.contents[key];

                    if (product) {
                        const card = document.createElement('div');
                        card.classList.add('item');
                        card.addEventListener('click', (e) => {
                            if (
                                !(e.target as HTMLElement).classList.contains(
                                    'btn'
                                )
                            ) {
                                console.log(`click to product ${product.id} `);
                            }
                        });

                        card.innerHTML = `<span class="delete-btn" data-artikul = ${
                            product.id
                        } data-price = ${product.price}></span>
                    <div class="image">
                      <img src="${product.images[0]}" alt="${product.title}"/>
                    </div>
                    <div class="info">
                        <div class="info__name">
                            <span>${product.title}</span>
                            <span>${product.brand}</span>
                        </div>
                      <span class="info__description"> 
                      ${product.description} </span>
                        <div class="info__details">
                            <span> Rating: ${product.rating}</span>
                            <span> Discount: 
                            ${product.discountPercentage}%</span>
                            <span> Stock: ${product.stock}</span>
                        </div>
                    </div>
                    <div class="quantity">
                        <button class="minus-btn" 
                        data-artikul = ${product.id} 
                        data-price = ${product.price} 
                        type="button" name="button">-</button>
                        <div class="amount">${productAmount}</div>
                        <button class="plus-btn" 
                        data-artikul = ${product.id} 
                        data-stock = ${product.stock} 
                        data-price = ${product.price} 
                        type="button" name="button">+</button></div>
                    <div class="price">$${product.price * productAmount}</div>`;
                        cartConteiner.append(card);
                    }
                }
            }

            document.querySelectorAll('.delete-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    if (
                        e.target instanceof HTMLElement &&
                        e.target.dataset.artikul &&
                        e.target.dataset.price
                    ) {
                        productInCart.deleteProduct(
                            e.target.dataset.artikul,
                            +e.target.dataset.price
                        );
                    }
                });
            });

            document.querySelectorAll('.plus-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    if (
                        e.target instanceof HTMLElement &&
                        e.target.dataset.artikul &&
                        e.target.dataset.stock &&
                        e.target.dataset.price
                    ) {
                        productInCart.plusProduct(
                            e.target.dataset.artikul,
                            e.target.dataset.stock,
                            +e.target.dataset.price
                        );
                    }
                });
            });

            document.querySelectorAll('.minus-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    if (
                        e.target instanceof HTMLElement &&
                        e.target.dataset.artikul &&
                        e.target.dataset.price
                    ) {
                        productInCart.minusProduct(
                            e.target.dataset.artikul,
                            +e.target.dataset.price
                        );
                    }
                });
            });

            this.createTotalBlock();
        }
    };

    createTotalBlock = () => {
        let totalBlock: HTMLDivElement;
        const totalBlockFromPage = document.querySelector('.total-block');
        if (totalBlockFromPage) {
            totalBlock = document.querySelector(
                '.total-block'
            ) as HTMLDivElement;
            totalBlockFromPage.innerHTML = '';
        } else {
            totalBlock = document.createElement('div');
            totalBlock.classList.add('total-block');
            main?.append(totalBlock);
        }

        totalBlock.innerHTML = `<h2 class="title">Summary</h2>
        <div class="totals">
            <p class="subtitle">Products: <span 
            class="total-cart__amount">${this.contents.amount}</span></p>
            <p class="subtitle">Total: <span class="total-cart__price">$${this.changeTotalPrice()}</span>
            <span class="total-cart__price_sale"></span></p></div>
            <div class="promo-code__block"><input class="promo-code" type="search" placeholder="Enter promo code">
            <div class="promos__block"></div>
            <span>Promo for test: "RSS", "EPM"</span></div>`;

        const btnBuy = document.createElement('button');
        btnBuy.classList.add('btn');
        btnBuy.classList.add('btn-buy');
        btnBuy.textContent = 'BUY NOW';
        totalBlock.append(btnBuy);
        btnBuy.addEventListener('click', () => {
            modal.openModalWindow();
        });

        promo.createPromo();
    };

    public checkCart = () => {
        const cartFromLocalSrorage = localStorage.getItem('cart');
        if (cartFromLocalSrorage) {
            this.contents = JSON.parse(cartFromLocalSrorage);
        }
        this.changeCartAmount();
        this.changeTotalPrice();
    };

    public addToCart = (id: number, price: number) => {
        this.contents[`${id}`]
            ? this.contents[`${id}`]++
            : (this.contents[`${id}`] = 1);
        this.contents.amount
            ? this.contents.amount++
            : (this.contents.amount = 1);
        this.contents.totalPrice
            ? (this.contents.totalPrice = this.contents.totalPrice + price)
            : (this.contents.totalPrice = price);

        this.updateCart();
    };

    public removeFromCart = (id: number, price: number) => {
        this.contents.amount = this.contents.amount - this.contents[id];
        this.contents.totalPrice =
            this.contents.totalPrice - this.contents[id] * price;
        delete this.contents[id];

        this.updateCart();
    };

    public updateCart = () => {
        this.changeCartAmount();
        this.changeTotalPrice();
        localStorage.setItem('cart', JSON.stringify(this.contents));
    };

    public cleanCart = () => {
        this.contents = {};

        this.changeCartAmount();
        this.changeTotalPrice();
        localStorage.setItem('cart', JSON.stringify(this.contents));
    };
}

export const cart: Cart = new Cart();
