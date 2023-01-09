import './style.css';
import { base } from '../goodsBase';
import { cart } from '../cart';
import { modal } from '../cart/modal-window';

class ProductPage {
    openProductPage = (id: number) => {
        const path = window.location.pathname;
        if (!path.includes('/product')) {
            const { origin } = new URL(window.location.href);
            console.log(origin);

            const newUrl = new URL(origin + `/product${id}`);
            console.log(newUrl);
            window.history.pushState({}, '', newUrl);
        }

        const currentProduct = base.products.find((item) => item.id === id);

        const main = document.querySelector('main');
        if (main) main.innerHTML = '';

        const productConteiner = document.createElement('nav');
        productConteiner.classList.add('product-conteiner');
        main?.append(productConteiner);

        const navigation = document.createElement('nav');
        navigation.classList.add('navigation');
        productConteiner?.append(navigation);

        navigation.innerHTML = `<ul><a href="/">STORE</a></ul> >> <ul> 
        <a href="#!">${currentProduct?.category}</a></ul> >> <ul><a href="#!">${currentProduct?.brand}</a></ul> 
        >> <ul><a href="#!">${currentProduct?.title}</a></ul>`;

        const product = document.createElement('div');
        product.classList.add('product');
        productConteiner?.append(product);

        product.innerHTML = `<div class="product__pics">
        <img src="${currentProduct?.images[0]}" alt="" class="product__pic_main" />
        <div class="pics__slider"></div></div>
        <div class="product__content">
        <h2 class="title product__name">${currentProduct?.title}</h2>
        <div class="product__description">${currentProduct?.description}</div>
        <ul class="product__info"><li>
                <span class="info_bold">Brand: </span>
                <span>${currentProduct?.brand}</span> </li><li>
                <span class="info_bold">Category: </span>
                <span>${currentProduct?.category}</span></li><li>
                <span class="info_bold">Discount Percentage: </span>
                <span>${currentProduct?.discountPercentage}% </span></li><li>
                <span class="info_bold">Rating: </span>
                <span>${currentProduct?.rating}</span></li><li>
                <span class="info_bold">Stock: </span>
                <span>${currentProduct?.stock}</span></li></ul></div><div class="product__buy-block">
        <p>$${currentProduct?.price}.00</p><button class="btn btn__toCart"></button>
        <button class="btn btn__buy-now">BUY NOW</button></div>`;

        const btnToCart = document.querySelector('.btn__toCart');
        cart.contents[id]
            ? ((btnToCart as HTMLElement).textContent = 'Drop from cart')
            : ((btnToCart as HTMLElement).textContent = 'To cart');

        btnToCart?.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).textContent === 'To cart') {
                if (currentProduct?.price) {
                    cart.addToCart(id, currentProduct?.price);
                }
                (e.target as HTMLElement).textContent = 'Drop from cart';
            } else {
                if (currentProduct?.price) {
                    cart.removeFromCart(id, currentProduct?.price);
                }
                (e.target as HTMLElement).textContent = 'To cart';
            }
        });

        document
            .querySelector('.btn__buy-now')
            ?.addEventListener('click', () => {
                if (!cart.contents[id]) {
                    if (currentProduct?.price) {
                        cart.addToCart(id, currentProduct?.price);
                    }
                }
                cart.openCart();
                modal.openModalWindow();
            });

        if (currentProduct?.images) {
            this.addImgs(currentProduct?.images);
        }
    };

    private addImgs = (images: string[]) => {
        const mainPic = document.querySelector('.product__pic_main');
        const picsSlider = document.querySelector('.pics__slider');

        setTimeout(() => {
            const newImages: string[] = [];
            const imagesSizes: string[] = [];
            images.forEach((img) => {
                const req = new XMLHttpRequest();
                req.open('GET', img, false);
                req.send();
                const size = req.getResponseHeader('Content-Length');
                if (size) {
                    if (!imagesSizes.includes(size)) {
                        imagesSizes.push(size);
                        newImages.push(img);
                    }
                }
            });

            newImages.forEach((img) => {
                const imgSmall = document.createElement('img');
                imgSmall.classList.add('product__pic_small');
                imgSmall.src = img;
                picsSlider?.append(imgSmall);

                imgSmall.addEventListener('click', () => {
                    if (mainPic instanceof HTMLImageElement) {
                        if (mainPic.src !== img) {
                            mainPic.src = img;
                        }
                    }
                });
            });
        }, 0);
    };
}

export const productPage: ProductPage = new ProductPage();
