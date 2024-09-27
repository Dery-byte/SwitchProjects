import { ChangeDetectorRef, Component, Injector, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import * as Razorpay from 'razorpay';
import { OrderDetails } from '../_model/order-details.model';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

declare var Razorpay: any;
@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css']
})
export class BuyProductComponent implements OnInit {

  isSingleProductCheckout: string = '';
  productDetails: Product[] = [] ;

  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    transactionId: '',
    orderProductQuantityList: []
  }

  constructor(private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private injector: Injector) { }

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get("isSingleProductCheckout");
    
    this.productDetails.forEach(
      x => this.orderDetails.orderProductQuantityList.push(
        {productId: x.productId, quantity: 1}
      )
    );
    console.log("This is the Product Details : ",this.productDetails)
    console.log("The Order Detial : ", this.orderDetails);
  }


  quantities: number[] = Array.from({ length: 8 }, (_, i) => i + 1);  // Generates [1, 2, 3, ..., 100]

  public placeOrder(orderForm: NgForm) {


    if(this.orderDetails.fullName!='' && this.orderDetails.fullAddress!=''&& 
      this.orderDetails.contactNumber!=''&& this.orderDetails.alternateContactNumber){
      this.productService.placeOrder(this.orderDetails, this.isSingleProductCheckout).subscribe(
        (resp) => {
          console.log(resp);
          orderForm.reset();
  
          const ngZone = this.injector.get(NgZone);
          ngZone.run(
            () => {
              this.router.navigate(["/orderConfirm"]);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    }else{
      alert("Please fill out all the details")
    }
    
  }


  getQuantityForProduct(productId) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );

    return filteredProduct[0].quantity;
  }

  getCalculatedTotal(productId, productDiscountedPrice) {
    const filteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return filteredProduct[0].quantity * productDiscountedPrice;
  }

  onQuantityChanged(q, productId) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = q;
  }

  getCalculatedGrandTotal() {
    let grandTotal = 0;

    this.orderDetails.orderProductQuantityList.forEach(
      (productQuantity) => {
        const price = this.productDetails.filter(product => product.productId === productQuantity.productId)[0].productActualPrice;
        grandTotal = grandTotal + price * productQuantity.quantity;
      }
    );
    return grandTotal;
  }

  createTransactionAndPlaceOrder(orderForm: NgForm) {


    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe(
      (response) => {
        console.log(response);
        this.placeOrder(orderForm);
        // this.openTransactioModal(response, orderForm);
      },
      (error) => {
        console.log(error);
      }
    );




  }

  openTransactioModal(response: any, orderForm: NgForm) {
    this.placeOrder(orderForm);

    console.log("This is the other ", orderForm)
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'In Everything Eat First',
      description: 'Payment of online shopping',
      image: 'https://cdn.pixabay.com/photo/2023/01/22/13/46/swans-7736415_640.jpg',
      handler: (response: any) => {
        if(response!= null && response.razorpay_payment_id != null) {
          this.processResponse(response, orderForm);
        } else {
          alert("Payment failed..")
        }
       
      },
      prefill : {
        name:'ACT',
        email: 'enjoylife@gmail.com',
        contact: '+23300000000'
      },
      notes: {
        address: 'Online Food Ordering'
      },
      theme: {
        color: '#F37254'
      }
    };

    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(resp: any, orderForm:NgForm) {
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    this.placeOrder(orderForm);
  }
}
