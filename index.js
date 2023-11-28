(function(exports) {


    function openModal (onOpen = null) {
    	let modalString = `<div id="gb-modal" style="display: none; position: fixed;  margin: auto;  width: 100%;  background-color: rgba(0,0,0,0.4);  height: 100%;  z-index: 99999;  left: 0; top: 0;"  class="modal"><div id="gb-modal-content" class="modal-content" style=" background-color: #fefefe; margin: auto;   height: 100%;  padding: 20px; border: 1px solid #888;"><span id="gb-close-modal" class="close" style="color: #aaaaaa; float: right; font-size: 28px;  font-weight: bold; cursor: pointer;  focus:color: #000;">&times;</span>
		    </div></div>`
        document.body.insertAdjacentHTML('afterend', modalString );

		let loaderString = `<div id="gb-loader" style="display: block; position: fixed;  margin: auto;  width: 100%;  background-color: rgba(0,0,0,0.4);  height: 100%;  z-index: 99999;  left: 0; top: 0;"  class="modal"><div id="gb-loader-content" class="modal-content" style="height: 800px; background-color: #fefefe; margin: auto;  padding: 20px; border: 1px solid #888; "><div style="width: 100%;  display: flex;  justify-content: center; margin: auto"><img src="https://ibank.greenbankcoin.com/images/processing.gif" id="loading-img" ></div></img></div></div>`
		document.body.insertAdjacentHTML('afterend', loaderString );

        if( typeof onOpen === 'function'){
            onOpen()
        }
    };


    function closeModal (isClicked = false, onClose = null){
    	let closeModalBtn = document.getElementById("gb-close-modal");
    	let modal = document.getElementById("gb-modal");
		if(closeModalBtn && modal){
            closeModalBtn.onclick = function() {
                modal.remove()
                if( typeof onClose === 'function'){
                    onClose()
                }
            }
            
            if(isClicked){
                closeModalBtn.click()
            }
        }
    //    if(isClicked && modal){
    //     modal.remove()
    //     if( typeof onClose === 'function'){
    //         onClose()
    //     }
    //    } 
    };

    function createIframe(url) {


        const frame = document.createElement('iframe');
        frame.src = url;
        frame.style.border = 'none';
        // frame.style.boxShadow = '0 20px 32px -8px rgba(9,20,66,0.25)';
        frame.style.zIndex = '9999';
        frame.style.transition = 'left 1s ease, bottom 1s ease, right 1s ease';
        frame.style.width = '100%';
        frame.style.height = '100%';
        frame.style.left = 'auto';
        frame.style.right = '-9999px';
        frame.style.bottom = '60px';
        frame.style.overflow = 'hidden';

        let modalContent = document.getElementById('gb-modal-content');
        modalContent.appendChild(frame);

        let loader = document.getElementById('gb-loader');
        let modal = document.getElementById('gb-modal');


        frame.addEventListener( "load", function(e) {
		    // alert(this.nodeName);
		    // console.log(e.target);
		    setTimeout(function(){
		    	loader.remove()
		    	modal.style.display = 'block'
		    }, 1000)
		});

    };


    exports.test = function() {
        return 'hello world'
    };

    exports.createPaymentLink = async function(payload) {
        
        let url = 'https://gcoin.greenbankcoin.com/api/v1/merchant/paymentlinks'
        if(payload.domain === 'live'){
            url = 'https://ibank.greenbankcoin.com/api/v1/merchant/paymentlinks'
        }
        if(payload.domain === 'sandbox'){
            url = 'https://gcoin.greenbankcoin.com/api/v1/merchant/paymentlinks'
        }

        if(payload.domain === 'test'){
            url = 'http://greenbankcoin.test/api/v1/merchant/paymentlinks'
        }
       
       try {

        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Content-Type": "application/json",
                "Merchant-Apikey": payload.merchant_key,
            },
            body: JSON.stringify(payload), // body data type must match "Content-Type" header

        });
        
        const jsonData = await response.json();

        if (response?.ok) {
            if( payload.onSuccess &&  typeof payload.onSuccess === 'function'){
                payload.onSuccess(jsonData)
            }
            return jsonData
        } else {
            if( typeof payload.onError === 'function'){
                payload.onError(jsonData)
            }
            return null
        }

       } catch (error) {
         console.error(error)
       }
    };

    exports.buycoin = async function(payload) {

        // merchant_no, customer_email, meta, description,  currency, amount, domain
    	payload.trxmeta = encodeURIComponent(JSON.stringify(payload.meta))
    	delete payload.meta

        let url = ''
        if(payload.domain === 'live'){
            url = 'https://ibank.greenbankcoin.com/g/buycoin'
        }
        if(payload.domain === 'sandbox'){
            url = 'https://gcoin.greenbankcoin.com/g/buycoin'
        }

        if(payload.domain === 'test'){
            url = 'http://greenbankcoin.test/g/buycoin'
        }
       

        if(window){
        	openModal()
            closeModal()
            const urlParams = new URLSearchParams(payload).toString();
            link = `${url}?${urlParams}`;
            createIframe(link)

            window.addEventListener('message', function (e) {
                // Get the sent data
                const data = e.data;
                if(data){
                    const decoded = JSON.parse(data);
                    if( typeof payload.callback === 'function'){
                        payload.callback(decoded)
                    }
                }
            });
        }

    };

    exports.loadPaymentLinkModal = async function(payload, params = {}, callback = () => {}) {

        let {link, onError, onSuccess, onOpen, onClose, ...data}  = payload;

       
        try {
            console.info('opening payment link', link)
            if(window){
                openModal(onOpen)
                closeModal(false)
               

                console.info('Opening payment link')
                createIframe(link, params)

                window.addEventListener('message', function (e) {
                    // Get the sent data
                    console.info('Received message',e )
                    const data = e.data;
                    if(data){
                        const decoded = JSON.parse(data);

                        if(decoded.gbstatus == 'successful'){
                            if( onSuccess && typeof onSuccess === 'function'){
                                onSuccess(decoded)
                                closeModal(true)
                            }
                        }
                    }
                });
            }

        } catch (error) {
            if( onError && typeof onError === 'function'){
                onError(error)
                closeModal(true)
            }
       }


    };

    exports.paymerchant = async function(payload) {
    	
        let {onError, onSuccess, onOpen, onClose, ...data}  = payload;
        console.info('creating payment link')
        // let paymentLink = this.createPaymentLink(data)

        let url = 'https://gcoin.greenbankcoin.com/api/v1/merchant/paymentlinks'
        if(data.domain === 'live'){
            url = 'https://ibank.greenbankcoin.com/api/v1/merchant/paymentlinks'
        }
        if(data.domain === 'sandbox'){
            url = 'https://gcoin.greenbankcoin.com/api/v1/merchant/paymentlinks'
        }

        if(data.domain === 'test'){
            url = 'http://greenbankcoin.test/api/v1/merchant/paymentlinks'
        }

       try {
         const response = await fetch(url, {
             method: "POST", // *GET, POST, PUT, DELETE, etc.
             mode: "cors", // no-cors, *cors, same-origin
             cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
             headers: {
                 "Content-Type": "application/json",
                 "Accept": "application/json",
                 "Merchant-Apikey": data.merchant_key,
             },
             body: JSON.stringify(data), // body data type must match "Content-Type" header
 
         });

         if (response?.ok) {
            const paymentLink = await response.json();     
            if ( paymentLink?.data && paymentLink.data?.link) {
                //  option to choose how 
                
                console.info('created payment link', paymentLink.data)
                // window.location = new URL(paymentLink.data.link)
                if(window){
                    openModal(onOpen)
                    closeModal(false)

                    console.info('Opening payment link')
                    createIframe(paymentLink.data?.link)
        
                    window.addEventListener('message', function (e) {
                        // Get the sent data
                        console.info('Received message',e )
                        const data = e.data;
                        if(data){
                            const decoded = JSON.parse(data);

                            if(decoded.gbstatus == 'successful'){
                                if( onSuccess && typeof onSuccess === 'function'){
                                    onSuccess(decoded)
                                    closeModal(true)
                                }
                            }
                        }
                    });
                }
            }
        } else {
            if( onError && typeof onError === 'function'){
                onError(response)
                closeModal(true)
                
            }
        }

         
        
       } catch (error) {
            if( onError && typeof onError === 'function'){
                onError(error)
                closeModal(true)
            }
       }
       
      
    }

    exports.exchangeRates = function() {};
    exports.exchange = function() {};


    exports.processPayment = async function(payload) {
        let url = 'https://gcoin.greenbankcoin.com/api/v1/merchant/process-payment'
        if(payload.domain === 'live'){
            url = 'https://ibank.greenbankcoin.com/api/v1/merchant/process-payment'
        }
        if(payload.domain === 'sandbox'){
            url = 'https://gcoin.greenbankcoin.com/api/v1/merchant/process-payment'
        }

        if(payload.domain === 'test'){
            url = 'http://greenbankcoin.test/api/v1/merchant/process-payment'
        }
       
       try {

        const response = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Content-Type": "application/json",
                "Merchant-Apikey": payload.merchant_key,
            },
            body: JSON.stringify(payload), // body data type must match "Content-Type" header

        });
        
        const jsonData = await response.json();

        if (response?.ok) {
            if( payload.onSuccess &&  typeof payload.onSuccess === 'function'){
                payload.onSuccess(jsonData)
            }
            return jsonData
        } else {
            if( typeof payload.onError === 'function'){
                payload.onError(jsonData)
            }
            return null
        }

       } catch (error) {
         console.error(error)
         return error
       }
    };

})(typeof exports === 'undefined' ? this['greenbank'] = {} : exports);


// module.exports = {log, shout, whisper};
// import * as Greenbank from 'greenbanksdk-js-client'

