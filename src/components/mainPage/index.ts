import './../../libs/reset.css';
import './style.css';
import { cart } from '../cart/index';
import { base } from '../goodsBase';
import { productPage } from '../productPage/index';

export interface product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

const { origin, pathname } = new URL(window.location.href);
const newUrl = new URL(pathname, origin);
console.log(origin, pathname);

const main = document.querySelector('main');
let filteredArray: product[];
let finedArray: (product | undefined)[] = [];
let resultArr: (product | undefined)[] = [];
resultArr = base.products;
filteredArray = base.products;

const goodsNumber = () => {
    const goods = document.querySelectorAll('.card');
    let count = 0;
    goods.forEach((item) => {
        if (!item.classList.contains('hide')) {
            count++;
        }
    });

    if (count === 0) {
        let zeroBlock: HTMLElement;
        const zeroBlockFromPage = document.querySelector('.zero-block');
        if (zeroBlockFromPage) {
            zeroBlock = document.querySelector('.zero-block') as HTMLDivElement;
            zeroBlockFromPage.innerHTML = '';
        } else {
            zeroBlock = document.createElement('p');
            zeroBlock.classList.add('zero-block');
            document.querySelector('.goods__conteiner')?.append(zeroBlock);
        }
        zeroBlock.innerHTML = 'Oops! We are not found any goods(';
    } else {
        const zeroBlockFromPage = document.querySelector('.zero-block');
        if (zeroBlockFromPage) {
            zeroBlockFromPage.innerHTML = '';
        }
    }

    return count;
};

export const createGoodsCards = (base: product[] | (product | undefined)[]) => {
    let products: HTMLDivElement;
    const productsFromPage = document.querySelector('.products');
    if (productsFromPage) {
        products = document.querySelector('.products') as HTMLDivElement;
        productsFromPage.innerHTML = '';
    } else {
        products = document.createElement('div');
        products.classList.add('products');
        main?.append(products);
    }

    const searchInputBlock = document.createElement('div');
    searchInputBlock.classList.add('view__block');
    products?.append(searchInputBlock);

    const viewMode = document.createElement('div');
    viewMode.classList.add('view__mode');
    searchInputBlock.append(viewMode);

    const smallView = document.createElement('div');
    smallView.classList.add('small__view');
    viewMode.append(smallView);

    const bigView = document.createElement('div');
    bigView.classList.add('big__view');
    bigView.classList.add('active');
    viewMode.append(bigView);


    for (let i = 0; i < 36; i++) {
        const point = document.createElement('div');
        point.classList.add('point');
        point.innerHTML = '.';
        smallView.append(point);
    }

    for (let i = 0; i < 16; i++) {
        const bigpoint = document.createElement('div');
        bigpoint.classList.add('big-point');
        bigpoint.innerHTML = '.';
        bigView.append(bigpoint);
    }

    let goodsConteiner: HTMLDivElement;
    const goodsConteinerFromPage = document.querySelector('.goods__conteiner');
    if (goodsConteinerFromPage) {
        goodsConteiner = document.querySelector(
            '.goods__conteiner'
        ) as HTMLDivElement;
        goodsConteinerFromPage.innerHTML = '';
    } else {
        goodsConteiner = document.createElement('div');
        goodsConteiner.classList.add('goods__conteiner');
        products?.append(goodsConteiner);
    }

    base.forEach((product: product | undefined) => {
        if (product) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.artikul = product.id + '';
            card.addEventListener('click', (e) => {
                if (!(e.target as HTMLElement).classList.contains('btn')) {
                    productPage.openProductPage(product.id);
                }
            });
            goodsConteiner.append(card);

            const image = document.createElement('img');
            image.classList.add('card__image');
            image.src = product.images[0];
            card.append(image);

            const description = document.createElement('div');
            description.classList.add('card__description');
            card.append(description);

            const name = document.createElement('p');
            name.classList.add('product__name');
            name.textContent = product.title;
            description.append(name);

            const brand = document.createElement('p');
            brand.classList.add('product__brand');
            brand.textContent = product.brand;
            description.append(brand);

            const price = document.createElement('p');
            price.classList.add('product__price');
            price.textContent = `$ ${product.price}`;
            description.append(price);

            const btn = document.createElement('button');
            btn.classList.add('btn');
            btn.classList.add('btn__toCart');
            btn.dataset.artikul = product.id + '';
            cart.contents[product.id]
                ? (btn.textContent = 'Drop from cart')
                : (btn.textContent = 'To cart');

            btn.addEventListener('click', (e) => {
                if ((e.target as HTMLElement).textContent === 'To cart') {
                    if (product.price) {
                        cart.addToCart(product.id, product.price);
                    }
                    (e.target as HTMLElement).textContent = 'Drop from cart';
                } else {
                    if (product.price) {
                        cart.removeFromCart(product.id, product.price);
                    }
                    (e.target as HTMLElement).textContent = 'To cart';
                }
            });
            card.append(btn);
        }
    });

    const cards = document.querySelectorAll('.card');
    const cardDesc = document.querySelectorAll('.card__description');

    smallView.addEventListener('click', () => {
        if (bigView.classList.contains('active')) {
            bigView.classList.remove('active');
        }
        smallView.classList.add('active');
        cards.forEach((card) => {
            card.classList.add('active');
        });
        cardDesc.forEach((card) => {
            card.classList.add('active');
        });
        newUrl.searchParams.set('view', `small`);
        window.history.pushState({}, '', newUrl);
    });

    bigView.addEventListener('click', () => {
        bigView.classList.add('active');
        if (smallView.classList.contains('active')) {
            smallView.classList.remove('active');
            cards.forEach((card) => {
                card.classList.remove('active');
            });
            cardDesc.forEach((card) => {
                card.classList.remove('active');
            });
        }
        newUrl.searchParams.set('view', `big`);
        window.history.pushState({}, '', newUrl);
    });

    const countGoods = document.createElement('p');
    countGoods.classList.add('count__goods');
    countGoods.textContent = `COUNT:${goodsNumber()}`;
    searchInputBlock.append(countGoods);
};

const sortFunctionUp = (
    arr: product[] | (product | undefined)[],
    sorter: string
) => {
    return (arr as product[]).slice().sort((a: product, b: product) => {
        return (
            (a[sorter as keyof typeof a] as number) -
            (b[sorter as keyof typeof b] as number)
        );
    });
};

const sortFunctionDown = (
    arr: product[] | (product | undefined)[],
    sorter: string
) => {
    return (arr as product[]).slice().sort((a: product, b: product) => {
        return (
            (b[sorter as keyof typeof b] as number) -
            (a[sorter as keyof typeof a] as number)
        );
    });
};

export const categoryFilter = (base: product[]) => {
    const arr: string[] = [];
    base.forEach((product: product) => {
        arr.push(product.category);
    });
    const categorySet = new Set(arr);
    return [...categorySet];
};

export const brandFilter = (base: product[]) => {
    const arr: string[] = [];
    base.forEach((product: product) => {
        arr.push(product.brand);
    });
    const brandSet = new Set(arr);
    return [...brandSet];
};

// add filter and sorting

export const createSorting = () => {
    const sorting = document.createElement('div');
    sorting.classList.add('sorting__conteiner');
    main?.append(sorting);

    const searchFormBlock = document.createElement('div');
    searchFormBlock.classList.add('search__form');
    sorting.append(searchFormBlock);

    const searchInput = document.createElement('input');
    searchInput.classList.add('search__input');
    searchInput.setAttribute('placeholder', 'Search...');
    searchFormBlock.append(searchInput);

    searchInput.addEventListener('input', function () {
        const val = this.value.trim();
        const reg = new RegExp(val, 'gi');
        if (val !== '') {
            newUrl.searchParams.set('search', `${val}`);
            window.history.pushState({}, '', newUrl);
            finedArray = [];
            base.products.forEach((product: product) => {
                if (
                    product.brand.search(reg) !== -1 ||
                    product.category.search(reg) !== -1 ||
                    product.description.search(reg) !== -1 ||
                    product.title.search(reg) !== -1 ||
                    (product.price + '').search(reg) !== -1 ||
                    (product.rating + '').search(reg) !== -1 ||
                    (product.discountPercentage + '').search(reg) !== -1
                ) {
                    finedArray.push(product);
                }
            });

            if (finedArray.length !== 0) {
                resultArr = finedArray.filter(function (v) {
                    if (v) {
                        return filteredArray.some(function (v2) {
                            return v.id == v2.id;
                        });
                    }
                });
            } else if (val.length !== 0) {
                resultArr = [];
            } else {
                resultArr = finedArray;
            }
            createGoodsCards(resultArr);
        } else {
            newUrl.searchParams.delete('search');
            window.history.pushState({}, '', newUrl);
            finedArray = [];
            resultArr = filteredArray;
            createGoodsCards(resultArr);
        }
    });

    const sortBlock = document.createElement('div');
    sortBlock.classList.add('sort__block');
    sorting.append(sortBlock);

    for (let i = 0; i < 4; i++) {
        const sortButton = document.createElement('button');
        sortButton.classList.add('sort__button');
        sortBlock.append(sortButton);
    }

    const sortButtons = document.querySelectorAll('.sort__button');
    sortButtons[0].innerHTML = 'Price ascending';
    sortButtons[0].addEventListener('click', () => {
        newUrl.searchParams.set('sort', `price-Asc`);
        window.history.pushState({}, '', newUrl);
        return createGoodsCards(sortFunctionUp(resultArr, 'price'));
    });

    sortButtons[1].innerHTML = 'Price descending';
    sortButtons[1].addEventListener('click', () => {
        newUrl.searchParams.set('sort', `price-Desc`);
        window.history.pushState({}, '', newUrl);
        return createGoodsCards(sortFunctionDown(resultArr, 'price'));
    });

    sortButtons[2].innerHTML = 'Rating ascending';
    sortButtons[2].addEventListener('click', () => {
        newUrl.searchParams.set('sort', `rating-Asc`);
        window.history.pushState({}, '', newUrl);
        return createGoodsCards(sortFunctionUp(resultArr, 'rating'));
    });

    sortButtons[3].innerHTML = 'Rating descending';
    sortButtons[3].addEventListener('click', () => {
        newUrl.searchParams.set('sort', `rating-Desc`);
        window.history.pushState({}, '', newUrl);
        return createGoodsCards(sortFunctionDown(resultArr, 'rating'));
    });


    // Create filter block

    const filterBlock = document.createElement('div');
    filterBlock.classList.add('filter__block');
    sorting.append(filterBlock);
    // addEvent INPUT for filterblock

    // create Category list

    const categoryBlock = document.createElement('div');
    categoryBlock.classList.add('category__block');
    categoryBlock.setAttribute('id', 'category');
    filterBlock.append(categoryBlock);

    const categoryTitle = document.createElement('h2');
    categoryBlock.append(categoryTitle);
    categoryTitle.innerHTML = 'Category';

    const categoryList = document.createElement('div');
    categoryList.classList.add('category__list');
    categoryBlock.append(categoryList);
    categoryFilter(base.products).forEach((item) => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category__item');
        categoryList.append(categoryItem);

        const categoryInput = document.createElement('input');
        categoryInput.setAttribute('type', 'checkbox');
        categoryInput.setAttribute('id', `${item}`);
        categoryInput.setAttribute('value', `${item}`);
        categoryList.append(categoryInput);

        const categoryLabel = document.createElement('label');
        categoryLabel.setAttribute('for', `${item}`);
        categoryLabel.textContent = `${item}`;
        categoryList.append(categoryLabel);
    });

    // Create brand block

    const brandBlock = document.createElement('div');
    brandBlock.classList.add('brand__block');
    brandBlock.setAttribute('id', 'brand');
    filterBlock.append(brandBlock);

    const brandTitle = document.createElement('h2');
    brandBlock.append(brandTitle);
    brandTitle.innerHTML = 'Brand';

    const brandList = document.createElement('div');
    brandList.classList.add('brand__list');
    brandBlock.append(brandList);
    brandFilter(base.products).forEach((item) => {
        const brandItem = document.createElement('div');
        brandItem.classList.add('brand__item');
        brandList.append(brandItem);

        const brandInput = document.createElement('input');
        brandInput.setAttribute('type', 'checkbox');
        brandInput.setAttribute('id', `${item}`);
        brandInput.setAttribute('value', `${item}`);
        brandList.append(brandInput);

        const brandLabel = document.createElement('label');
        brandLabel.setAttribute('for', `${item}`);
        brandLabel.textContent = `${item}`;
        brandList.append(brandLabel);
    });

    // create price block

    const priceBlock = document.createElement('div');
    priceBlock.classList.add('price__block');
    priceBlock.setAttribute('id', 'price');
    filterBlock.append(priceBlock);

    const priceTitle = document.createElement('h2');
    priceTitle.innerHTML = 'Price';
    priceBlock.append(priceTitle);

    const priceValues = document.createElement('div');
    priceValues.classList.add('price__values');
    priceBlock.append(priceValues);

    for (let i = 0; i < 3; i++) {
        const priceSpan = document.createElement('span');
        priceValues.append(priceSpan);
    }

    const priceSpan = document.querySelectorAll('.price__values span');
    priceSpan[0].classList.add('price-range1');
    priceSpan[0].innerHTML = '10$';
    priceSpan[1].innerHTML = '-';
    priceSpan[2].classList.add('price-range2');
    priceSpan[2].innerHTML = '1749$';

    const priceFormBlock = document.createElement('div');
    priceFormBlock.classList.add('price__form-block');
    priceBlock.append(priceFormBlock);

    const priceInputTrack = document.createElement('div');
    priceInputTrack.classList.add('price__track');
    priceFormBlock.append(priceInputTrack);

    for (let i = 0; i < 2; i++) {
        const priceInput = document.createElement('input');
        priceInput.setAttribute('type', 'range');
        priceInput.setAttribute('min', '10');
        priceInput.setAttribute('max', '1749');
        priceInput.classList.add('price__input');
        priceFormBlock.append(priceInput);
    }

    const priceInputs = document.querySelectorAll('.price__input');
    priceInputs[0].classList.add('price-min');
    priceInputs[0].setAttribute('value', '10');
    priceInputs[1].classList.add('price-max');
    priceInputs[1].setAttribute('value', '1749');

    const minGap = 0;

    function priceOne() {
        const priceMin = parseInt((<HTMLInputElement>priceInputs[0]).value);
        const priceMax = parseInt((<HTMLInputElement>priceInputs[1]).value);
        if (priceMax - priceMin <= minGap) {
            (<HTMLInputElement>priceInputs[0]).value = String(
                priceMax - minGap
            );
        }
        priceSpan[0].innerHTML = `${(<HTMLInputElement>priceInputs[0]).value}$`;
    }

    function priceTwo() {
        const priceMin = parseInt((<HTMLInputElement>priceInputs[0]).value);
        const priceMax = parseInt((<HTMLInputElement>priceInputs[1]).value);
        if (priceMax - priceMin <= minGap) {
            (<HTMLInputElement>priceInputs[1]).value = String(
                priceMin + minGap
            );
        }
        priceSpan[2].innerHTML = `${(<HTMLInputElement>priceInputs[1]).value}$`;
    }

    priceInputs[0].addEventListener('input', priceOne);
    priceInputs[1].addEventListener('input', priceTwo);

    // create stock block

    const stockBlock = document.createElement('div');
    stockBlock.classList.add('stock__block');
    stockBlock.setAttribute('id', 'stock');
    filterBlock.append(stockBlock);

    const stockTitle = document.createElement('h2');
    stockTitle.innerHTML = 'Stock';
    stockBlock.append(stockTitle);

    const stockValues = document.createElement('div');
    stockValues.classList.add('stock__values');
    stockBlock.append(stockValues);

    for (let i = 0; i < 3; i++) {
        const stockSpan = document.createElement('span');
        stockValues.append(stockSpan);
    }

    const stockSpan = document.querySelectorAll('.stock__values span');
    stockSpan[0].classList.add('stock-range1');
    stockSpan[0].innerHTML = '2';
    stockSpan[1].innerHTML = '-';
    stockSpan[2].classList.add('stock-range2');
    stockSpan[2].innerHTML = '150';

    const stockFormBlock = document.createElement('div');
    stockFormBlock.classList.add('stock__form-block');
    stockBlock.append(stockFormBlock);

    const stockInputTrack = document.createElement('div');
    stockInputTrack.classList.add('stock__track');
    stockFormBlock.append(stockInputTrack);

    for (let i = 0; i < 2; i++) {
        const stockInput = document.createElement('input');
        stockInput.setAttribute('type', 'range');
        stockInput.setAttribute('min', '2');
        stockInput.setAttribute('max', '150');
        stockInput.classList.add('stock__input');
        stockFormBlock.append(stockInput);
    }

    const stockInputs = document.querySelectorAll('.stock__input');
    stockInputs[0].classList.add('stock-min');
    stockInputs[0].setAttribute('value', '2');
    stockInputs[1].classList.add('stock-max');
    stockInputs[1].setAttribute('value', '150');

    function stockOne() {
        const stockMin = parseInt((<HTMLInputElement>stockInputs[0]).value);
        const stockMax = parseInt((<HTMLInputElement>stockInputs[1]).value);
        if (stockMax - stockMin <= minGap) {
            (<HTMLInputElement>stockInputs[0]).value = String(
                stockMax - minGap
            );
        }
        stockSpan[0].innerHTML = `${(<HTMLInputElement>stockInputs[0]).value}`;
    }

    function stockTwo() {
        const stockMin = parseInt((<HTMLInputElement>stockInputs[0]).value);
        const stockMax = parseInt((<HTMLInputElement>stockInputs[1]).value);
        if (stockMax - stockMin <= minGap) {
            (<HTMLInputElement>stockInputs[1]).value = String(
                stockMin + minGap
            );
        }
        stockSpan[2].innerHTML = `${(<HTMLInputElement>stockInputs[1]).value}`;
    }

    stockInputs[0].addEventListener('input', stockOne);
    stockInputs[1].addEventListener('input', stockTwo);

    // create filter Function

    const filterGoods = () => {
        const category = [
            ...document.querySelectorAll('.category__list input:checked'),
        ].map((n: Element) => (n as HTMLInputElement).value);

        const brand = [
            ...document.querySelectorAll('.brand__list input:checked'),
        ].map((v: Element) => (v as HTMLInputElement).value);


        const priceMin = (<HTMLInputElement>(
            document.querySelector('.price-min')
        )).value;

        const priceMax = (<HTMLInputElement>(
            document.querySelector('.price-max')
        )).value;

        const stockMin = (<HTMLInputElement>(
            document.querySelector('.stock-min')
        )).value;

        const stockMax = (<HTMLInputElement>(
            document.querySelector('.stock-max')
        )).value;

        if (
            category.length === 0 &&
            brand.length === 0 &&
            +priceMin === 10 &&
            +priceMin === 10 &&
            +priceMax === 1749 &&
            +stockMin === 2 &&
            +stockMax === 150
        ) {
            filteredArray = base.products;
        } else {
            filteredArray = (base.products as product[]).filter(
                (n: product) => {
                    return (
                        (!category.length || category.includes(n.category)) &&
                        (!brand.length || brand.includes(n.brand)) &&
                        (!priceMin || +priceMin <= n.price) &&
                        (!priceMax || +priceMax >= n.price) &&
                        (!stockMin || +stockMin <= n.stock) &&
                        (!stockMax || +stockMax >= n.stock)
                    );
                }
            );
        }

        if (
            resultArr.length === 0 &&
            finedArray.length === 0 &&
            filteredArray.length === 0
        ) {
            resultArr = [];
        } else if (finedArray.length !== 0) {
            resultArr = finedArray.filter(function (v) {
                if (v) {
                    return filteredArray.some(function (v2) {
                        return v.id == v2.id;
                    });
                }
            });
        } else {
            resultArr = filteredArray;
        }

        if (category.length !== 0) {
            newUrl.searchParams.set('category', `${category}`);
            window.history.pushState({}, '', newUrl);
        }
        else {
            newUrl.searchParams.delete('category');
            window.history.pushState({}, '', newUrl);
        }

        if (brand.length !== 0) {
            newUrl.searchParams.set('brand', `${brand}`);
            window.history.pushState({}, '', newUrl);
        }
        else {
            newUrl.searchParams.delete('brand');
            window.history.pushState({}, '', newUrl);
        }

        if (+priceMin > 10 || +priceMax < 1749) {
            newUrl.searchParams.set('price', `${priceMin}↕${priceMax}`);
            window.history.pushState({}, '', newUrl);
        }
        else {
            newUrl.searchParams.delete('price');
            window.history.pushState({}, '', newUrl);
        }

        if (+stockMin > 2 || +stockMax < 150) {
            newUrl.searchParams.set('stock', `${stockMin}↕${stockMax}`);
            window.history.pushState({}, '', newUrl);
        }
        else {
            newUrl.searchParams.delete('stock');
            window.history.pushState({}, '', newUrl);
        }

        createGoodsCards(resultArr);
    };
    filterBlock.addEventListener('input', () => {
        // if (e?.target as HTMLInputElement && e?.target !== null && e !== null && e.currentTarget !== null && e.currentTarget as HTMLDivElement) {
        //     e.preventDefault();
        //     const { origin } = new URL(window.location.href);
        //     console.log(origin);
        //     const catVal = (<HTMLDivElement>e.target).parentNode?.parentNode;
        //     const idVal = (<HTMLDivElement>catVal).id;
        //     console.log(idVal);
        //     const val = (<HTMLInputElement>e.target).value;

        //     const priceMin = (<HTMLInputElement>(
        //         document.querySelector('.price-min')
        //     )).value;
        //     console.log(`input=${priceMin}`);

        //     const priceMax = (<HTMLInputElement>(
        //         document.querySelector('.price-max')
        //     )).value;
        //     console.log(priceMax, 'priceMax');
        //     let newUrl = new URL(origin + `?${idVal}=${val}`);

        //     if ((<HTMLInputElement>e.target).classList.contains('price-min') || (<HTMLInputElement>e.target).classList.contains('price-max')) {
        //         newUrl = new URL(origin + `?${idVal}=${priceMin}↕${priceMax}`);
        //     }

        //     const stockMin = (<HTMLInputElement>(
        //         document.querySelector('.stock-min')
        //     )).value;

        //     const stockMax = (<HTMLInputElement>(
        //         document.querySelector('.stock-max')
        //     )).value;

        //     if ((<HTMLInputElement>e.target).classList.contains('stock-min') || (<HTMLInputElement>e.target).classList.contains('stock-max')) {
        //         newUrl = new URL(origin + `?${idVal}=${stockMin}↕${stockMax}`);
        //     }
        //     console.log(newUrl);
        //     window.history.pushState({}, '', newUrl);
        // }

        return filterGoods();
    });
};
