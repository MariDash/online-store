import { cart } from '.';

class Promo {
    code: { [key: string]: string };

    constructor() {
        if (localStorage.getItem('promo')) {
            const promoLocalStorage = localStorage.getItem('promo');
            if (!promoLocalStorage) {
                throw new ReferenceError('Promo not found');
            } else {
                this.code = JSON.parse(promoLocalStorage);
            }
        } else {
            this.code = {};
        }
    }

    public createPromo = () => {
        const inputPromo = document.querySelector('.promo-code');
        const promosBlock = document.querySelector('.promos__block');
        this.updatePromo();
        inputPromo?.addEventListener('input', () => {
            console.log('here');
            this.updatePromo();
            const value = (inputPromo as HTMLInputElement).value
                .trim()
                .toLowerCase();
            if (value === 'rss' || value === 'epm') {
                if (this.code[value]) {
                    console.log('here1');
                    const promoCode = document.createElement('div');
                    promoCode.innerHTML = `${value.toUpperCase()} - 10%`;
                    promosBlock?.append(promoCode);
                } else {
                    console.log('here2');
                    const promoCode = document.createElement('div');
                    promoCode.innerHTML = `${value.toUpperCase()} - 10%`;
                    promosBlock?.append(promoCode);

                    const btnAdd = document.createElement('button');
                    btnAdd.textContent = 'ADD';
                    btnAdd.classList.add('btn');
                    btnAdd.classList.add('btn-add');
                    btnAdd.addEventListener('click', () => {
                        this.code[value] = '10%';
                        this.updatePromo();
                    });
                    promoCode.append(btnAdd);
                }
            } else {
                console.log('here3');
            }
        });
    };

    private updatePromo = () => {
        localStorage.setItem('promo', JSON.stringify(this.code));
        const promoLocalStorage = localStorage.getItem('promo');
        const promosBlock = document.querySelector('.promos__block');
        const totalPrice = document.querySelector('.total-cart__price');
        totalPrice?.classList.remove('cross');
        const totalPriceSale = document.querySelector(
            '.total-cart__price_sale'
        );
        if (totalPriceSale) totalPriceSale.innerHTML = '';

        if (promoLocalStorage) {
            const promos = JSON.parse(promoLocalStorage);
            if (promos['rss'] || promos['epm'])
                totalPrice?.classList.add('cross');
            if (totalPriceSale) {
                if (totalPrice?.innerHTML && (promos['rss'] || promos['epm'])) {
                    if (promos['rss'] && promos['epm']) {
                        totalPriceSale.innerHTML = `$${(
                            cart.contents.totalPrice * 0.8
                        ).toFixed(2)}`;
                    } else {
                        totalPriceSale.innerHTML = `$${(
                            cart.contents.totalPrice * 0.9
                        ).toFixed(2)}`;
                    }
                }
            }
            if (promosBlock) {
                promosBlock.innerHTML = '';
                for (const key in promos) {
                    const promoCode = document.createElement('div');
                    promoCode.innerHTML = `${key.toUpperCase()} - ${
                        promos[key]
                    }`;
                    promosBlock.append(promoCode);

                    const btnDrop = document.createElement('button');
                    btnDrop.textContent = 'DROP';
                    btnDrop.classList.add('btn');
                    btnDrop.classList.add('btn-drop');
                    btnDrop.addEventListener('click', () => {
                        delete this.code[key];
                        this.updatePromo();
                    });

                    promoCode.append(btnDrop);
                }
            }
        }
    };

    public cleanPromo = () => {
        this.code = {};
        localStorage.setItem('promo', JSON.stringify(this.code));
    };
}

export const promo: Promo = new Promo();
