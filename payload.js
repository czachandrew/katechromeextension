console.log("This is the payload js");
if(document.readyState === 'complete') {
    // good to go!
   // console.log("ready!");
}

//document.body.style.backgroundColor = 'red';

var items = document.getElementsByClassName("cart-item-table");

console.log(items);

window.addEventListener("load", function(){
	chrome.runtime.sendMessage({message: 'Load successful', function (response) {
		console.log(response);
	}});
});

var cart = Array.from(items);

var message = [];

addEventListener("click", function(){
	console.log(cart);

	var payload = {item: '', price:0,quantity:0};
	var messageObj = [];

	cart.forEach(function(item, index){
		console.log("I'm looping" + index);
		//loop through each row only the first row on CDW is going to have product information
		for(var i = 0, row; row = item.rows[i]; i++){
			for(var j = 0, col; col = row.cells[j]; j++){
				//if column is zero it has the image and product details 
				if(j == 0){
					var thing = col.getElementsByClassName("product-link");
					var smalls = col.getElementsByTagName('small');
					console.log(smalls);
					console.log("here is the small loop");
					for (var s = 0; s < smalls.length; s++) {
						var text = smalls[s].innerText; 
						if(text.indexOf("MFG Part:") !== -1){
							console.log("I found the part number");
							var mfg = text.substring(text.indexOf(":") + 2);
							payload.mfgpart = mfg;
						} else if(text.indexOf("CDW Part:") !== -1){
							console.log("I found the CDW Part Number");
							var vp = text.substring(text.indexOf(":") + 2);
							payload.vendorpart = vp; 
						} else if(text.indexOf("UNSPSC:") !== -1){
							console.log("I found the UNSPC number");
							var unspc = text.substring(text.indexOf(":") + 2);
							payload.unspc = unspc;
						}
						////console.log(smalls[s].innerText);
						
					}
					
					console.log("Here is the end of the small loop");
					console.log("Here is the thing");
					console.log(thing[0].innerText);
					console.log("Here is the entire row");
					console.log(col);
					payload.item = thing[0].innerText;
				}
				if(j == 2) {
					var price = col.getElementsByClassName("amount");
					console.log("Here is the price");
					console.log(price[0].innerText);
					payload.price = price[0].innerText;
				}
				if(j == 3) {
					var  qty = col.getElementsByClassName("qty-field");
					console.log("here is the quantity field");
					console.log(qty[0].value);
					payload.quantity = qty[0].value;
				}
				//console.log(payload);

				

				
				//console.log("here is the column number " + j);
				//console.log(col);
			}
		}
		messageObj.push(payload); 
		console.log("here is the message object"); 
		console.log(messageObj);
		payload = {item: '', price:0, quantity: 0};

		//loop through each column
		
	});
	chrome.runtime.sendMessage({fn: 'setCart', cart:messageObj}, function (response) {
	console.log(response);
});
	message = [];
});

