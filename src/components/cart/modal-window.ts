import { cart } from '.';
import { createSorting, createGoodsCards } from '../mainPage';
import { base } from '../goodsBase';
import { promo } from './promo';

const main = document.querySelector('main');

class ModalWindow {
    public openModalWindow = () => {
        let modalWindow: HTMLDivElement;
        const modalWindowFromPage = document.querySelector('.modal-window');
        if (modalWindowFromPage) {
            modalWindow = document.querySelector(
                '.modal-window'
            ) as HTMLDivElement;
            modalWindowFromPage.innerHTML = '';
        } else {
            modalWindow = document.createElement('div');
            modalWindow.classList.add('modal-window');
            main?.append(modalWindow);
        }
        modalWindow.style.display = 'flex';

        modalWindow.innerHTML = `<form class="modal-window__form form" action="" novalidate>
        <div class="person__details form__details">
            <h2 class="title">Personal details</h2>
            <div class="person__name form__item">
                <input class="input__name" type="text" placeholder="Name" required>
                <p class="error">Error</p></div>
            <div class="phone form__item">
                <input class="input__phone" type="text" placeholder="Phone number" required>
                <p class="error">Error</p></div>
            <div class="adress form__item">
                <input class="input__adress" type="text" placeholder="Delivery adress" required>
                <p class="error">Error</p></div>
            <div class="email form__item">
                <input class="input__email" type="email" placeholder="E-mail" required>
                <p class="error">Error</p></div>
        <div class="credit-card__details form__details">
            <h2 class="title">Credit card details</h2>
            <div class="credit-card">
                <div class="card__number">
                    <img class="card__img" src="../../assets/card.png" alt="card">
                    <input class="input__card" type="text" placeholder="Card number" required>
                    <p class="error">Error</p></div>
                <div class="card__info">
                    <div class="valid-date"> Valid: 
                        <input class="input__date" type="text" placeholder="Valid Thru" required>
                        <p class="error">Error</p></div>
                    <div class="cvv"> CVV: 
                        <input class="input__cvv" type="text" placeholder="Code" required>
                        <p class="error">Error</p></div>
                </div></div></div>
        <input type="submit" class="btn btn-pay" value="Pay Now"></form>`;

        this.backdropOpenClose(true);

        const inputs: (Element | null)[] = [];

        const inputName = document.querySelector('.input__name');
        inputs.push(inputName);
        inputName?.addEventListener('input', () => {
            const valueArr = (inputName as HTMLInputElement).value
                .trim()
                .split(' ');
            const regExp = /^([a-zA-Z]|[а-яА-Я]){3,}$/;
            valueArr.forEach((value) => {
                if (regExp.test(value) && valueArr.length >= 2) {
                    inputName.classList.remove('invalid');
                } else {
                    inputName.classList.add('invalid');
                }
            });
        });

        const inputPhone = document.querySelector('.input__phone');
        inputs.push(inputPhone);
        inputPhone?.addEventListener('input', () => {
            const value = (inputPhone as HTMLInputElement).value.trim();
            const regExp = /^(\+)\d{9,}$/;
            if (regExp.test(value)) {
                inputPhone.classList.remove('invalid');
            } else {
                inputPhone.classList.add('invalid');
            }
        });

        const inputAdress = document.querySelector('.input__adress');
        inputs.push(inputAdress);
        inputAdress?.addEventListener('input', () => {
            const valueArr = (inputAdress as HTMLInputElement).value
                .trim()
                .split(' ');
            const regExp = /^([a-zA-Z]|[а-яА-Я]){5,}$/;
            valueArr.forEach((value) => {
                if (regExp.test(value) && valueArr.length >= 3) {
                    inputAdress.classList.remove('invalid');
                } else {
                    inputAdress.classList.add('invalid');
                }
            });
        });

        const inputEmail = document.querySelector('.input__email');
        inputs.push(inputEmail);
        inputEmail?.addEventListener('input', () => {
            const value = (inputEmail as HTMLInputElement).value.trim();
            const regExp =
                /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
            if (regExp.test(value)) {
                inputEmail.classList.remove('invalid');
            } else {
                inputEmail.classList.add('invalid');
            }
        });

        const inputCard = document.querySelector('.input__card');
        const cardImg = document.querySelector('.card__img');
        inputs.push(inputCard);
        inputCard?.addEventListener('input', () => {
            if (!/^\d+$/.test((inputCard as HTMLInputElement).value)) {
                (inputCard as HTMLInputElement).value = (
                    inputCard as HTMLInputElement
                ).value.slice(0, -1);
            }
            if ((inputCard as HTMLInputElement).value.length > 16) {
                (inputCard as HTMLInputElement).value = (
                    inputCard as HTMLInputElement
                ).value.slice(0, 16);
            }
            const value = (inputCard as HTMLInputElement).value;

            if (cardImg instanceof HTMLImageElement) {
                if (value[0] === '4') {
                    cardImg.src =
                        'https://cdn.visa.com/v2/assets/images/logos/visa/blue/logo.png';
                } else if (value[0] === '5') {
                    cardImg.src =
                        'https://www.mastercard.hu/content/dam/public/mastercardcom/eu/hu/images/mc-logo-52.svg';
                } else if (value[0] === '6') {
                    cardImg.src =
                        'https://m.unionpayintl.com/imp_file/global/wap/en/static/images/logo.png';
                } else {
                    cardImg.src = './assets/card.png';
                }
            }

            const regExp = /^\d{16}$/;
            if (regExp.test(value)) {
                inputCard.classList.remove('invalid');
            } else {
                inputCard.classList.add('invalid');
            }
        });

        const inputDate = document.querySelector('.input__date');
        inputs.push(inputDate);
        inputDate?.addEventListener('input', () => {
            const valueArr = (inputDate as HTMLInputElement).value
                .split('')
                .map((item, index) => {
                    if (/^\d$/.test(item) && index < 5) {
                        return item;
                    } else {
                        return '';
                    }
                });

            const value = valueArr
                .map((item, index) => {
                    if (index === 1 && valueArr.length > 2) {
                        return item + '/';
                    } else {
                        return item;
                    }
                })
                .join('');

            (inputDate as HTMLInputElement).value = value;

            if (value.length === 5 && +(value[0] + value[1]) <= 12) {
                inputDate.classList.remove('invalid');
            } else {
                inputDate.classList.add('invalid');
            }
        });

        const inputCVV = document.querySelector('.input__cvv');
        inputs.push(inputCVV);
        inputCVV?.addEventListener('input', () => {
            if (!/^\d+$/.test((inputCVV as HTMLInputElement).value)) {
                (inputCVV as HTMLInputElement).value = (
                    inputCVV as HTMLInputElement
                ).value.slice(0, -1);
            }
            if ((inputCVV as HTMLInputElement).value.length > 3) {
                (inputCVV as HTMLInputElement).value = (
                    inputCVV as HTMLInputElement
                ).value.slice(0, 3);
            }
            const value = (inputCVV as HTMLInputElement).value;
            const regExp = /^\d{3}$/;
            if (regExp.test(value)) {
                inputCVV.classList.remove('invalid');
            } else {
                inputCVV.classList.add('invalid');
            }
        });

        const btnBuy = document.querySelector('.btn-pay');
        btnBuy?.addEventListener('click', (e) => {
            e.preventDefault();
            const validInputs: Element[] = [];
            inputs.map((input) => {
                if (
                    (input as HTMLInputElement).value === '' ||
                    (input as HTMLInputElement).classList.contains('invalid')
                ) {
                    input?.classList.add('invalid');
                } else {
                    if (input) validInputs.push(input);
                }
            });

            if (validInputs.length === 7) {
                const modal = document.querySelector('.modal-window');
                if (modal) {
                    modal.innerHTML = 'Thanks for your order!';
                    cart.cleanCart();
                    promo.cleanPromo();

                    setTimeout(() => {
                        this.closeModalWindow();
                        this.backdropOpenClose(false);
                        if (main) main.innerHTML = '';
                        createSorting();
                        createGoodsCards(base.products);

                        const cartIco = document.querySelector('.header__cart');
                        cartIco?.addEventListener('click', () => {
                            cart.openCart();
                        });
                    }, 3000);
                }
            }
        });
    };

    private closeModalWindow = () => {
        const modalWindow = document.querySelector('.modal-window');
        if (modalWindow && modalWindow instanceof HTMLDivElement) {
            modalWindow.style.display = 'none';
        }
    };

    private backdropOpenClose = (condition: boolean) => {
        let backdrop: HTMLDivElement | null;
        if (document.querySelector('.backdrop')) {
            backdrop = document.querySelector('.backdrop');
        } else {
            backdrop = document.createElement('div');
            backdrop.classList.add('backdrop');
            document.body.append(backdrop);
            backdrop.addEventListener('click', () => {
                this.closeModalWindow();
                this.backdropOpenClose(false);
            });
        }

        if (backdrop) {
            condition
                ? (backdrop.style.display = 'block')
                : (backdrop.style.display = 'none');
        }
    };
}

export const modal: ModalWindow = new ModalWindow();
