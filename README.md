# greenbanksdk-js-client
```js
import * as Greenbank from 'greenbanksdk-js-client'

let params = {
  amount: 1, 
  currency: 'USD', 
  description: 'Approval Fee', 
  domain: 'sandbox', // live, test, sandbox
  merchant_no: 'XXXXXXXX', 
  email: 'user@hsola.com', 
  meta: {
    txntype: 'examfee', 
    product_id: 134
  },

  callback: (res) => {
    console.log(res)
  },
  onclose: () =>{
  }

}

Greenbank.paymerchant(params)
      

```
