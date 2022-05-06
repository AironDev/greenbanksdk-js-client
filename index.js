(function(exports) {


    function openModal () {
    	let modalString = `<div id="gb-modal" style="display: none; position: fixed;  margin: auto;  width: 100%;  background-color: rgba(0,0,0,0.4);  height: 100%;  z-index: 99999; padding-top: 100px; left: 0; top: 0;"  class="modal"><div id="gb-modal-content" class="modal-content" style=" background-color: #fefefe; margin: auto;  padding: 20px; border: 1px solid #888;  width: 70%;  border-radius: 30px;"><span id="gb-close-modal" class="close" style="color: #aaaaaa; float: right; font-size: 28px;  font-weight: bold; cursor: pointer;  focus:color: #000;">&times;</span>
		    </div></div>`
        document.body.insertAdjacentHTML('afterend', modalString );

		let loaderString = `<div id="gb-loader" style="display: block; position: fixed;  margin: auto;  width: 100%;  background-color: rgba(0,0,0,0.4);  height: 100%;  z-index: 99999; padding-top: 100px; left: 0; top: 0;"  class="modal"><div id="gb-loader-content" class="modal-content" style="height: 400px; background-color: #fefefe; margin: auto;  padding: 20px; border: 1px solid #888;  width: 70%;  border-radius: 30px;"><div style="width: 100%;  display: flex;  justify-content: center; margin: auto"><img src="https://ibank.greenbankcoin.com/images/processing.gif" id="loading-img" ></div></img></div></div>`
		document.body.insertAdjacentHTML('afterend', loaderString );


        // let loaderWrapperDiv = document.createElement('div');
        // loaderWrapperDiv.innerHTML = modalString;
        // document.body.appendChild(loaderWrapperDiv)
    };


  
    function closeModal(){
    	let closeModalBtn = document.getElementById("gb-close-modal");
    	let modal = document.getElementById("gb-modal");
		closeModalBtn.onclick = function() {
  			modal.remove()
		}
    };

    function createIframe(url, payload) {

        const frame = document.createElement('iframe');
        
        // {merchant_no, customer_email, meta , description,  currency, amount, domain}
        const urlParams = new URLSearchParams(payload).toString();
        frame.src = `${url}?${urlParams}`;
        

        frame.style.border = 'none';
        // frame.style.boxShadow = '0 20px 32px -8px rgba(9,20,66,0.25)';
        frame.style.zIndex = '9999';
        frame.style.transition = 'left 1s ease, bottom 1s ease, right 1s ease';
        frame.style.width = '100%';
        frame.style.height = '400px';
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
            createIframe(url, payload)

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

    exports.paymerchant = async function(payload) {
    	// merchant_no, customer_email, meta, description,  currency, amount, domain
    	payload.trxmeta = encodeURIComponent(JSON.stringify(payload.meta))
    	delete payload.meta

        let url = ''
        if(payload.domain === 'live'){
            url = 'https://ibank.greenbankcoin.com/g/paymerchant'
        }
        if(payload.domain === 'sandbox'){
            url = 'https://gcoin.greenbankcoin.com/g/paymerchant'
        }

        if(payload.domain === 'test'){
            url = 'http://greenbankcoin.test/g/paymerchant'
        }
       
        if (window) {
        	openModal()
            closeModal()
            createIframe(url, payload)

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
    }
    exports.exchangeRates = function() {};
    exports.exchange = function() {};

})(typeof exports === 'undefined' ? this['greenbank'] = {} : exports);


// <script src="greenbank.js"></script>
// <script>
//     alert(greenbank.test());
// </script>


// module.exports = {log, shout, whisper};
// import * as Greenbank from 'greenbanksdk-js-client'

