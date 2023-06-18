# greenbanksdk-js-client


### 
```js Paymerchant
import * as Greenbank from 'greenbanksdk-js-client'

  let payload = {
      amount: 1, 
      currency: 'NGN', 
      description: 'Invoice payment Fee', 
      channels: ["flutterwave","paypal"], 
      customer_firstname: 'John', 
      customer_lastname: 'Eliam', 
      customer_email: 'user@onewattsolar.com', 
      redirect_url: "https://google.com",
      meta: {
        txntype: 'invoice_payment', 
        invoice_id: 134
      },
      callback: (res) =>{
        // example - do something
        console.log(res)
      },
      
      domain: 'test',
      merchant_key: apikey,
  }


  Greenbank.paymerchant(params)
      

```


 ### createPaymentLink
```js
import * as Greenbank from 'greenbanksdk-js-client'


  //method will return payment reference
  // merchant can then load the paymerchant page with the reference that was returned.
  // pass redirect_url
  // pass selected payment channels

  let params = {
    amount: 1, 
    currency: 'NGN', 
    description: 'Invoice payment Fee', 
    channels: ["flutterwave","paypal"], 
    customer_firstname: 'John', 
    customer_lastname: 'Eliam', 
    customer_email: 'user@onewattsolar.com', 
    redirect_url: "https://google.com",
    meta: {
      txntype: 'invoice_payment', 
      invoice_id: 134
    },
    onSuccess: (res) =>{
      // example - you can redirect to paymentlink here or just save the link
      window.location = new URL(res.data.link)
      console.log(res)
    },
    onError: (res) =>{
      alert('error occured')
      console.log(res)
    },
    onClose: () =>{
      alert('hello payment closed')
      console.log('colose')
    },
    domain: 'test',
    merchant_key: apikey,
  }
			
	Greenbank.createPaymentLink(params)

```