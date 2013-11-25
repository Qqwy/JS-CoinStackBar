/*
		CoinStackBarBar: A customizable vertical progress bar in the shape of a stack of coins.
		Author: Wiebe-Marten Wijnja(W-M@gmx.us)
		Commissioned by: SlyFoxy12
		Released under the GPLv3:
		
		    This library is free software: you can redistribute it and/or modify
			it under the terms of the GNU General Public License as published by
			the Free Software Foundation, either version 3 of the License, or
			(at your option) any later version.

			This library is distributed in the hope that it will be useful,
			but WITHOUT ANY WARRANTY; without even the implied warranty of
			MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
			GNU General Public License for more details.

			You should have received a copy of the GNU General Public License
			along with this library.  If not, see <http://www.gnu.org/licenses/>.
		
		
		*/
		
		/*Features:
		-Coins with random displacement from center, making it look stacked by hand.
		-All settings are easily changed/adpted to your own coin image
		-Uses deterministic randomness thus if needed the stack can set to stack exactly same each time, on all computers.
		-Optional Shadow effect (works in all browsers that support CSS Gradients: IE 9+, Webkit(Chrome, Safari, Opera), FireFox)
		-Automatic animation, fully editable:(x and y move distance as well as the animation speed)
		-Support for multiple different coin images in the same stack.
		-Can be set to any min-max value and coin stack height.
		*/
		
		
		/*Parameters:
		An object, with the following Properties:
			Required:
				container: A reference to a HTML element that should contain this stack.
				coinimgsrc: 
					String ->Source of the coin image. Relative or absolute URL/URI.
					Array -> When an array is passed, each time a random coin image will be chosen. Please note that all coin images do need to have the same dimensions for this to work.
				coinimgwidth: Width of the coin image.
				coinimageheight: Height of the coin image.
				coinheight: The vertical height of the coin, in px. This is the thickness of the coin in the image.

				
			
		Optional:
			min: Minimum value of stack. Default: 0;
			max: Maximum value of stack. Default: 100;
			startvalue: Value to start the stack on. Default: 0;
			maxstackheight: The maximum amount of coins the stack can contain. This is the amount shown when value >= max. Default: 10;
			containerwidth: width in px of the final effect. Everything will be scaled so it fits this width. In px. If both a width and height are set, the smaller one will be used. The other one will be changed to fit the aspect-ratio.
			containerheight: height in px of the final effect. Everything will be scaled so it fits this height. In px. If both a width and height are set, the smaller one will be used. The other one will be changed to fit the aspect-ratio.
			xoffset: The maximum amount that the X value of a coin can change during stacking. Default:0.
			yoffset: The maximum amount that the Y value of a coin can change during stacking. Default:0.
			coinanimxdrop: amount to move in from the left while fading in. In px. Negative moves from the right. Default:0.
			coinanimydrop: amount to move in from the top while fading in. In px. Negative moves from the bottom (Looks odd). Default: 300.
			coineffectduration: Length to fade in/fade out coins when they drop. Default: 300 msec.
			showshadow: Boolean. Doesn't create a shadow if false. Default: true.
			seed: Starting seed for this stack. Using the same seed will produce the same stack on every computer. If not set, will create a random seed in the constructor.
			reseed: String with three possible values: If 'onzero', the seed value is changed whenever the stack is fully empty. If 'always', the seed value is changed after each coin. If 'never', the same seed will be used the whole time. Default:'always'.
			
		*/
		
		//Test object:
			/*{
					container:,
					coinimgsrc:,
					coinimgwidth:,
					coinimgheight:,
					coinheight:,
					xoffset:,
					yoffset:,
					
					min:,
					max:,
					startvalue:,
					maxstackheight:,
					containerwidth:,
					containerheight:,
					seed:,
					reseed:,
					coineffectduration:,
					showshadow:

			}*/
		function CoinStackBar(o){
			//Initialize parameters
			//---------------------
			this.container = o.container;
			
			this.coinimgsrc = o.coinimgsrc;
			this.coinimgwidth = o.coinimgwidth || 1;
			this.coinimgheight = o.coinimgheight || 1;			
			this.coinheight = o.coinheight || 1;
			
			
			//Initialize optional parameters.
			//---------------------
			this.min = o.min||0;
			this.max = o.max||100;
			this.value = 0;
			this.maxstackheight = o.maxstackheight || 10;
			this.xoffset = o.xoffset || 10;
			this.yoffset = o.yoffset || 5;
			
			
			
			this.setDimensions(o.containerwidth, o.containerheight);
			
			
			
			
			
			this.seed = o.seed || Math.random();
			
			
			if(o.reseed=='aways'||o.reseed=='never'||o.reseed=='onzero'){
				this.reseed= o.reseed;
			}else{
				this.reseed = 'always';
			}
			this.coineffectduration = o.coineffectduration || 300;
			if(typeof(o.showshadow)!='undefined'){
				this.showshadow = o.showshadow;
			}else{
				this.showshadow = true;
			}
			
			this.coinanimxdrop = o.coinanimxdrop || 0;
			this.coinanimydrop = o.coinanimydrop || 300;
			
			
			//Initialize Default properties of the CoinStackBar object.
			//---------------------
			
			//Array with all coin objects
			this.coins = [];
			
			//Styling of container element.
			this.container.style.position="relative";
			
			this.containerheight = ((this.coinimgheight+this.maxstackheight*this.coinheight)*this.stacksize);
			this.containerwidth  = (this.coinimgwidth+2*this.xoffset)*this.stacksize;
			this.container.style.height=this.containerheight +"px";
			this.container.style.width=this.containerwidth + "px";
			//this.container.style.marginLeft="auto";
			//this.container.style.marginRight="auto";
			
			//Create shadow
			this.shadow = document.createElement('div');
			this.shadow.style.position='relative';
			//Shadow is twice the width and height of the coins.
			this.shadowwidth = this.coinimgwidth*this.stacksize*2;
			this.shadow.style.width= this.shadowwidth + 'px';
			this.shadow.style.height = this.coinimgheight*this.stacksize*2 + 'px';
			this.shadow.style.top = this.containerheight-(this.coinimgheight*this.stacksize*1.5) + 'px';//Todo for other images?
			this.shadow.style.left = -(this.shadowwidth/4)+'px';
			this.shadow.style.opacity=0;//Always start invisible.
			//The shadow is dependent on CSS radial gradients: Won't work in IE8 or lower.
			this.shadow.style.background= '-webkit-radial-gradient(ellipse closest-side, black, rgba(0,0,0,0))';
			this.shadow.style.background = 'radial-gradient(ellipse closest-side, black, rgba(0,0,0,0))';
			
			//Add shadow to container
			this.container.appendChild(this.shadow);
			
			//Append this object to the container element so it can be called that way as well.
			this.container.CoinStackBar = this;
			
			//Initializing the starting value
			//---------------------
			this.setValue(o.startvalue||0);
			
			
			//Start update loop to make the animation run.
			this.update();
		}
		
		/*CoinStackBar.rand: Method that returns a simple seedable deterministic random number between -1.0 and 1.0 using trigonometry;
		Parameters:
			val: Value to use as input for the RNG.
			seed: Seed to use in combination with the value. 
			
			Same (value, seed) combination will always output the same number across systems.
		*/
		CoinStackBar.prototype.rand = function(val, seed){
			return Math.cos(val*Math.cos(val*seed));
		}
		
		/*CoinStackBar.setDimensions: Method to change the width or height of the CoinStackBar.
			Called in constructor.
		Optional Parameters:
			containerwidth:
			containerheight:
			If none of them are set, the stack will be full scale.
		*/
		CoinStackBar.prototype.setDimensions=function(containerwidth, containerheight){
			var picksmaller = '';			
			//Precalculate dimensions depending on the containerwidth and containerheight set.
			var widthsize = containerwidth/this.coinimgwidth;
			var heightsize = containerheight/(this.coinimgheight+this.maxstackheight*this.coinheight);
			//If both parameters are set, choose the one that creates the smaller resulting stack.
			if(typeof(containerwidth)!='undefined'&&typeof(containerheight)!='undefined'){
				if(widthsize<heightsize){
					picksmaller = 'width';
				}else{
					picksmaller = 'height';
				}
			}
			//Otherwise, choose the one that is set.
			if(typeof(containerwidth)=='undefined'||picksmaller=='height'){
				this.stacksize = heightsize;
			}else if(typeof(containerheight)=='undefined'||picksmaller=='width'){
				this.stacksize = widthsize;
			}else{
				//Otherwise, create stack at full scale.
				this.stacksize = 1;
			}
		}
		
		/*Changes the minimum and maximum value of the CoinStackBar.
		TODO: Maybe update maxstackheight as well?
		Optional Parameters:
			newmin: A new minimum value for the stack.
			newmax: A new maximum value for the stack.
		*/
		CoinStackBar.prototype.updateMinMax= function(newmin, newmax){
			if(typeof(newmin)!='undefined'){
				this.min = newmin;
			}
			if(typeof(newmax)!='undefined'){
				this.max = newmax;
			}
		}
		
		/*CoinStackBar.setValue:Method to set the current value of the stack.
	(This is the function that should be called from your code after the object has been created.)
		Parameters:
			value: A numerical value that the stack will change to. The stack will automatically clamp this value between the min and max set during creation.
		Optional parameters:	
			newmin: A new minimum value for the stack.
			newmax: A new maximum value for the stack.
		Returns: true if the value is changed, false if the value is the same as the value it had.
		*/
		CoinStackBar.prototype.setValue = function(value, newmin, newmax){
		//If set, update minimum and maximum values.
			if(typeof(newmin)!='undefined'||typeof(newmax)!='undefined'){
				this.updateMinMax(newmin, newmax);
			}
			
			
			//Ensure that the value is between the minimum and the maximum of the CoinStackBar.
			var clamped = Math.min(Math.max(value, this.min), this.max);
			
			
			if(clamped == this.value){//Do nothing if there's no change in value
				return false;
			}
			
			//Otherwise: Calculate the amount of coins to show for the current value. 
			var coins = Math.round((clamped/this.max)*this.maxstackheight);
			//Also calculate the amount of coins that were already in the stack.
			var oldcoins = Math.round((this.value/this.max)*this.maxstackheight);
			
			//If we want to reseed, change the seed.
			if(this.reseed=='always' || (coins==0&&oldcoins!=0&&this.reseed=="onzero")){
				this.seed=this.rand(this.seed, this.seed+1);
			}
			
			//If there are more coins than before, add new ones until at the new height.
			if(coins>oldcoins){
				for(var i=oldcoins;i<coins;i++){
					this.createNewCoin(i, i-oldcoins);
				}
			//If there are less, remove coins (fade them out) until at new height.
			}else if(coins < oldcoins){
				for(var i=oldcoins;i>=coins;i--){
					this.fadeOutCoin(i, oldcoins-i);
				}
			}
			
			//Update the shadow's opacity to the amount of coins compared to the maximum height.
			if(this.showshadow){
				this.shadow.style.opacity=coins/this.maxstackheight;
			}
			//Store the value to be used next time this function is called.
			this.value = clamped;
			
			return true;
		}
		
		
		/*CoinStackBar.createNewCoin:Internal Method that creates a new coin object when needed.
		Parameters:
			i:number of the coin in the stack array.
			/durationoffset: When this coin should start fading in. When adding many coins at the same time, this value is changed for each coin to make the effect look more natural.
		*/
		CoinStackBar.prototype.createNewCoin = function(i, durationoffset){
				//Creates image element with the correct source.
				var coinelem = document.createElement('img');
				
				//If array, pick an image at random.
				if(Object.prototype.toString.call(this.coinimgsrc) === '[object Array]'){
					var index = Math.floor(Math.abs(this.rand(i+1,this.seed)*this.coinimgsrc.length));
					coinelem.src=this.coinimgsrc[index];
				}else{
					coinelem.src = this.coinimgsrc;
				}
				
				//Sets the x and y position of the coin. A pseudo-random value is used so we can restack the stack exactly the same each time, if we want to.
				var coinxpos =  +this.rand(i, this.seed)*(this.xoffset*this.stacksize);
				var coinypos = i*(this.coinheight*this.stacksize )+ this.rand(i, this.seed)*(this.yoffset*this.stacksize);

				coinelem.style.position="absolute";
				coinelem.style.width=this.coinimgwidth*this.stacksize+"px";
				coinelem.style.height=this.coinimgheight*this.stacksize+"px";
				coinelem.style.opacity=0;//Default to 0 to avoid rendering glitches on slower PC's
				
				this.container.appendChild(coinelem);

				//Time at which the coin should fade in. If there's more than one coin, ensure that the time is later than that of the coin below to make the effect look more natural.
				var starttime = Date.now();
				if(this.coins.length > 0){
					starttime = Math.max(this.coins[this.coins.length-1].starttime+this.coineffectduration*0.3, starttime);
				}
				//Add the coin to the array so we can change and remove it again later.
				this.coins.push({
					element:coinelem, 
					starttime:starttime,
					xpos:coinxpos, 
					ypos:coinypos, 
					xstart:this.coinanimxdrop, 
					ystart:this.coinanimydrop, 
					duration:this.coineffectduration, 
					status:'fadein'
				});
				
		}
		
		/*CoinStackBar.fadeOutCoin:Internal Method that fades out a coin. Called when needed.
		Parameters:
			i:number of the coin in the stack array.
			durationoffset: When this coin should start fading in. When adding many coins at the same time, this value is changed for each coin to make the effect look more natural.
		*/
		CoinStackBar.prototype.fadeOutCoin = function(i, durationoffset){
			//Only fade out if not already fading out.
			if(this.coins[i]&&this.coins[i].status != 'fadeout'){
					this.coins[i].starttime = Date.now()+(durationoffset*this.coins[i].duration*0.3);
					this.coins[i].status = 'fadeout';
			}
		}
		/*CoinStackBar.removeCoin: Method that Removes a coin from the coins array as well as the coin element from the container. Called internally.
		Parameters:
			i: CoinStackBar.coins array index. as well as the index of the coin img element in the container element.
		*/
		CoinStackBar.prototype.removeCoin = function(i){
			var coins = this.container.getElementsByTagName("img");
			if(coins[i]){
				this.container.removeChild(coins[i]);
				if(this.coins[i]){
					this.coins.splice(i, 1);
				}
			}
		}
		
		/*CoinStackBar.update:Method to be called each frame. Is called automatically using requestAnimationFrame.
		*/
		CoinStackBar.prototype.update = function(){
			//Do nothing if no coins visible.
			if(this.coins){
				//Update all coins
				this.coins.forEach(function(coin, key, CoinStackBar){
					//animframe = fraction (0.0-1.0) of time between start and start+duration.
					var animframe = 1.0-((coin.starttime+coin.duration)-Date.now())/coin.duration; 
					animframe = Math.max(Math.min(1,animframe), 0);

					//Fade coin in.
					if(coin.status=='fadein'){
						coin.element.style.bottom=coin.ypos+(coin.ystart*(1.0-animframe)*this.stacksize)+"px";
						coin.element.style.left=coin.xpos+(coin.xstart*(1.0-animframe)*this.stacksize)+"px";
						coin.element.style.opacity = animframe;
						if(animframe >=1){
							coin.status='idle';
						}
					}
					
					//Fade coin out -> essentially the same as fading in but backwards.
					if(coin.status=='fadeout'){
						coin.element.style.bottom=coin.ypos+(coin.ystart*(animframe)*this.stacksize)+"px";
						coin.element.style.left=coin.xpos+(coin.xstart*(1.0-animframe)*this.stacksize)+"px";
						coin.element.style.opacity = 1.0-animframe;//TODO?
						if(animframe>=1){
							this.removeCoin(key);
						}
						//If coins below me are still fading in while I am fading out, lower my opacity, to prevent graphical glitches (e.g. floating coins).
						if(this.coins[key-1]){
							coin.element.style.opacity = Math.min(coin.element.style.opacity, CoinStackBar[key-1].element.style.opacity);
						}
					}
				},this);
			}
			
			
			//Cross-browser version of requestAnimationFrame. Keeps the animation going by calling the CoinStackBar.update() method 60 times a second.		
			var self = this;
			var requestAnimFrame = (function(callback){
					return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function(callback){
						window.setTimeout(callback, 1000 / 60);
					};
				})();
			requestAnimFrame(function(){self.update()});
		}
		
