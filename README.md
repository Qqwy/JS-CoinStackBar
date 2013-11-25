JS-CoinStackBar
===============

A customizable vertical progress bar in the shape of a stack of coins.

This project was mainly created to be used on Bitcoin-themed web sites, but can of course be used on any web site that likes coins or stacks of other small objects.

This project took quite some effort to complete. If you want to help me out, consider donating a few Bitcoincents to: **1Cg76Ft1Juhorwxs1HV8ER7D3rpvPpq9yF**

#Features
- Coins with random displacement from center, making it look stacked by hand.
- All settings are easily changed/adpted to your own coin image
- Uses deterministic randomness thus if needed the stack can set to stack exactly same each time, on all computers.
- Optional Shadow effect (works in all browsers that support CSS Gradients: IE 9+, Webkit(Chrome, Safari, Opera), FireFox)
- Automatic animation, fully editable:(x and y move distance as well as the animation speed)
- Support for multiple different coin images in the same stack.
- Can be set to any min-max value and coin stack height.

#Examples
Check out [this jsfiddle](http://jsfiddle.net/uHA9F/4/) for a quick example.
A more advanced example can be found and downloaded straight here from the repository.


#Usage

1. The fist step would be to include the latest version of coinStackBar.js in the web page you want to use it on:
```<script src=coinStackBar.js></script>```
2. Also, ensure that you have a * <div> * element in your page where you want to create a stack.
3. To create a stack, call:
```new CoinStackBar(options); ```


**options** should be an object, containing the following properties:
* **container**: A reference to a HTML element that should contain this stack.
*	**coinimgsrc**: 
   -	String ->Source of the coin image. Relative or absolute URL/URI.
   -  Array -> When an array is passed, each time a random coin image will be chosen. Please note that all coin images do need to have the same dimensions for this to work.
* **coinimgwidth**: Width of the coin image.
* **coinimageheight**: Height of the coin image.
* **coinheight**: The vertical height of the coin, in px. This is the thickness of the coin in the image.
**options** can also contain the following optional parameters:
* **min:** Minimum value of stack. Default: 0;
* **max**: Maximum value of stack. Default: 100;
* **startvalue**: Value to start the stack on. Default: 0;
* **maxstackheight**: The maximum amount of coins the stack can contain. This is the amount shown when value >= max. Default: 10;
* **containerwidth**: width in px of the final effect. Everything will be scaled so it fits this width. In px. If both a width and height are set, the smaller one will be used. The other one will be changed to fit the aspect-ratio.
* **containerheight**: height in px of the final effect. Everything will be scaled so it fits this height. In px. If both a width and height are set, the smaller one will be used. The other one will be changed to fit the aspect-ratio.
* **xoffset**: The maximum amount that the X value of a coin can change during stacking. Default:0.
* **yoffset**: The maximum amount that the Y value of a coin can change during stacking. Default:0.
* **coinanimxdrop**: amount to move in from the left while fading in. In px. Negative moves from the right. Default:0.
* **coinanimydrop**: amount to move in from the top while fading in. In px. Negative moves from the bottom (Looks odd). Default: 300.
* **coineffectduration**: Length to fade in/fade out coins when they drop. Default: 300 msec.
* **showshadow**: Boolean. Doesn't create a shadow if false. Default: true.
* **seed**: Starting seed for this stack. Using the same seed will produce the same stack on every computer. If not set, will create a random seed in the constructor.
* **reseed**: String with three possible values: If 'onzero', the seed value is changed whenever the stack is fully empty. If 'always', the seed value is changed after each coin. If 'never', the same seed will be used the whole time. Default:'always'.

An example would be:

``` 
var cs = new CoinStackBar({
					container:document.getElementById("coinstack_element"),
					coinimgsrc:'bitcoin.svg',
					coinimgwidth:200,
					coinimgheight:100,
					coinheight:30,
					xoffset:10,
					yoffset:6,
					
					startvalue:25,
					maxstackheight:30,
					containerwidth:50,
			});
```
			
After this, whenever needed, you can call ```cs.setValue(some_value)```. The Coin Stack will then automatically animate to the next value.

This function also takes an optional **newmin** and **newmax** parameter, to recalibrate the scale of the coin stack.

You can refer to the coinStack object either by keeping a reference to it, or by using the .coinStack property of the the container element again (by using ```document.getElementById('bar').CoinStackBar.setValue(40)``` or, if you are using jQuery: ```$('#bar').CoinStackBar.setValue(40)``` )


For more in-depth information, check the comments inside the non-minified code.
