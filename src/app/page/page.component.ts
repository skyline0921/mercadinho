import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  cartItems: any[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  orderConfirmed: boolean = false;

  constructor(private notifier: NotifierService) { }

  ngOnInit(): void {
  }

  buy(product: any) {
    // Verifica se o produto já está no carrinho
    const existingProduct = this.cartItems.find(item => item.name === product.name);
    
    if (existingProduct) {
      // Se o produto já estiver no carrinho, aumenta a quantidade
      existingProduct.quantity += 1;
      this.notifier.notify('success', `Increased quantity of ${product.name}.`);
    } else {
      // Se não estiver no carrinho, adiciona com quantidade inicial 1
      this.cartItems.push({ ...product, quantity: 1 });
      this.notifier.notify('success', `${product.name} added to cart.`);
    }

    // Atualiza o total de itens e preço total
    this.totalItems += 1;
    this.totalPrice += product.price;
  }

  decreaseQuantity(product: any) {
    const existingProduct = this.cartItems.find(item => item.name === product.name);

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        // Diminui a quantidade se houver mais de um
        existingProduct.quantity -= 1;
        this.totalItems -= 1;
        this.totalPrice -= product.price;
        this.notifier.notify('info', `Decreased quantity of ${product.name}.`);
      } else {
        // Remove o produto do carrinho se a quantidade for 1
        this.removeProduct(product);
      }
    }
  }

  removeProduct(product: any) {
    // Remove o produto do carrinho
    this.cartItems = this.cartItems.filter(item => item.name !== product.name);
    this.totalItems -= product.quantity; 
    this.totalPrice -= product.price * product.quantity;

    this.notifier.notify('warning', `${product.name} removed from cart.`);

    if (this.cartItems.length === 0) {
      this.orderConfirmed = false;
      this.notifier.notify('info', 'Cart is empty.');
    }
  }

  confirmOrder() {
    if (this.cartItems.length > 0) {
      this.orderConfirmed = true;
      this.notifier.notify('success', 'Order confirmed!');
    } else {
      this.notifier.notify('error', 'Your cart is empty.');
    }
  }

  startNewOrder() {
    this.cartItems = [];
    this.totalItems = 0;
    this.totalPrice = 0;
    this.orderConfirmed = false;
    this.notifier.notify('info', 'Started a new order.');
  }
}
