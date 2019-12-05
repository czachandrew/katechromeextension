var console = chrome.extension.getBackgroundPage().console;

var app = {
	currentCart:{},
	init:function() {
		var sendInput = document.getElementById("sendBtn");
		var clearInput = document.getElementById("clearBtn");
		var self = this; 

		chrome.runtime.sendMessage({fn:'getCart'}, function(response){
			console.log(response);
			console.log('That should be the cart from background.js');
			
			self.currentCart = response;
			console.log("now calling make display");
			self.makeDisplay();
			
		});

		sendInput.addEventListener("click", function(){
			console.log('Button clicked');
			console.log(self.currentCart);
			chrome.runtime.sendMessage({fn:'sendFred', cart: self.currentCart});
		});

		clearInput.addEventListener("click", function(){
			var self = this;
			console.log('Clear Clicked!');
			chrome.runtime.sendMessage({fn: "clearCart"}, function(response){
				console.log(response);
				self.currentCart = response;
				self.makeDisplay();
			});
		})
	},
	makeDisplay:function(){
		console.log('Making output with ');
		console.log(this.currentCart);
		var html = '';
		this.currentCart.forEach(function(item, index){
				html += "<div class='row'><table class='table'><tr><td>"+ item.item +"</td>" + item.quantity +"<td>" + item.price + "</td><td></td></tr></table></div>";
				console.log('Looping through the cart');
			});
			document.getElementById('items_found').innerHTML = html;
	}

}

console.log('This is the popup js');
console.log(document.readyState);
if(document.readyState === 'complete') {
    // good to go!
    console.log("ready!");
}

chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		console.log(sender.tab ? "from a content script:" + sender.tab.url :
			"from the xtension");
		console.log(request);
		var html = '';
		if(request.cart){

			request.cart.forEach(function(item, index){
				html += "<div class='row'><table class='table'><tr><td>"+ item.item +"</td>" + item.quantity +"<td></td><td></td></tr></table></div>";
				//then we need to store this somewhere so evertime the extension is clicked it reloads

			});
			sendResponse({thanks: "Got the cart"});
		}
		document.getElementById('items_found').innerHTML = html;
	});

function sendResponse(){
	chrome.runtime.sendMessage({response:'Success'});
}

document.addEventListener("DOMContentLoaded", function(){
	app.init();
});