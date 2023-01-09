import { cart } from './index';

class Product {
    public deleteProduct = (id: string, price: number) => {
        cart.removeFromCart(+id, price);
        cart.openCart();
    };

    public minusProduct = (id: string, price: number) => {
        cart.contents.amount = cart.contents.amount - 1;
        cart.contents.totalPrice = cart.contents.totalPrice - price;
        cart.contents[id]--;
        if (cart.contents[id] < 1) {
            this.deleteProduct(id, price);
        } else {
            this.updateProducts();
        }
    };

    public plusProduct = (id: string, stock: string, price: number) => {
        if (cart.contents[id] >= +stock) {
            alert('This item is no longer in stock');
        } else {
            cart.contents.amount = cart.contents.amount + 1;
            cart.contents.totalPrice = cart.contents.totalPrice + price;
            cart.contents[id]++;
            this.updateProducts();
        }
    };

    private updateProducts = () => {
        cart.updateCart();
        cart.openCart();
    };
}

export const productInCart: Product = new Product();
