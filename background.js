var background = {
	cart: {},
	init: function() {
		//here is where we do all the initialization functions for the background app
		//listen  for any message and route to the correct function
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			if(request.fn in background) {
				background[request.fn](request, sender, sendResponse);
			}
		});
	},
	setCart: function(request, sender, sendResponse){
		console.log("Setting the cart");
		console.log(request.cart);
		this.cart = request.cart;
	},
	getCart: function(request, sender, sendResponse) {
		console.log(this.cart);
		//console.log(cart);
		sendResponse(this.cart);
	},
	clearCart: function(request, sender, sendResponse) {
		this.cart = {};
		sendResponse(this.cart);
	},
	sendFred: function(request, sender, sendResponse) {
		console.log("Here is where I would send a message to FRED");
		console.log(request.cart);
		request.cart.forEach(function(item, index){
			var number = Number(item.price.replace(/[^0-9\.-]+/g,""));
			item.provider = 'CDW';
			item.walmartPrice = (number * .96).toFixed(2);
			item.amazonPrice = (number * .98).toFixed(2);
		});
		console.log(request.cart);
		var xmlhttp = new XMLHttpRequest();
		var url = 'http://fredmaster.test/api/cart/remote';



		xmlhttp.onreadystatechange = function(){
			if (xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status == 200) {
				console.log('Received a response');
				console.log(xmlhttp.response);
				var myArr = JSON.parse(xmlhttp.responseText);
				var arr = myArr;
				console.log(arr);
			}
		};
		//var cart = new Array();
		//cart.cart = request.cart;
		var cart = request;

		var payload = JSON.stringify(cart);
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-type", "application/json");
		xmlhttp.send(payload);
		console.log('Http request has been sent, this is what I sent');
		console.log(payload);
		//send the cart over to the FRED app backend

	}
}

//startup 
background.init();



chrome.browserAction.onClicked.addListener(function(tab){
	console.log("something was clicked");
	console.log(tab);
});

/** chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		//console.log(sender.tab ? "from a content script:" + sender.tab.url :
			//"from the xtension");
			console.log("I have received a message");
		if(request.cart){
			sendResponse({thanks: "Got the cart"});
		}
		}
	});
**/
function sendResponse(){
	console.log("I am sending a response now!");
}