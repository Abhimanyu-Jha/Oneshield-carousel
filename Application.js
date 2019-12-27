/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('CarouselApp.Application', {
    extend: 'Ext.app.Application',

    name: 'CarouselApp',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },
    launch:function(){
		
		// Oneshield Carousel v1.0
		// Author: Abhimanyu Jha (intern)
		// Date Created: 27th December 2019

		// +======================================================================+
		// 0. Follow the 7 steps mentioned to add or deleted slides in the carousel
		// +======================================================================+


		// This Stack is written using the pseudoclassical pattern
		// DO NOT MODIFY
		// Creates a stack
		var Stack = function() {
			this.count = 0;
			this.storage = {};
		}

		// empties the stack
		Stack.prototype.empty = function(){
			this.storage={};
			this.count=0;
		}
		// Adds a value onto the end of the stack
		Stack.prototype.push = function(value) {
			this.storage[this.count] = value;
			this.count++;
		}

		// Removes and returns the value at the end of the stack
		Stack.prototype.pop = function() {
			// Check to see if the stack is empty
			if (this.count === 0) {
				return undefined;
			}

			this.count--;
			var result = this.storage[this.count];
			delete this.storage[this.count];
			return result;
		}

		// Returns the length of the stack
		Stack.prototype.size = function() {
			return this.count;
		}
		
		

		// +======================================================================+
		// 1. change this according to number of slides , assign center,left,right slides		
		numberOfSlides=5
		var centerSlide='carousel-slide-2';
		var leftSlide='carousel-slide-1';
		var rightSlide='carousel-slide-3';
		// +======================================================================+

		var extremeRightSlide=new Stack();
		var extremeLeftSlide=new Stack();

		// +======================================================================+
		// 2. CHANGE THIS TO TURN ON AUTO SLIDE CHANGING
		var enableAutoScrolling=true;

		// 3. Slide change duration (in Seconds)
		var timeInSeconds=4;

		// 4. The first slide that appears on the carousel
		// 	  By default set to 2nd slide
		var currentSlide=2;
		// +======================================================================+
		


		rightButtonHidden=false;
		leftButtonHidden=false;

		// Auto-navigate Carousel
		var autoSlideChange=true;
		if(enableAutoScrolling){
			setInterval(function(){
				if(autoSlideChange){
					currentSlide=(currentSlide==numberOfSlides) ? 1: currentSlide+1;
					changeSlide(currentSlide);
					updatePillState(currentSlide);
				}
			},timeInSeconds*1000);
		}

		// decide whether to hide left/right buttons or not
		var buttonCheck=function(){
			if(rightSlide==null){
				Ext.get('carousel-navButton-next').addCls("hide-button");
				rightButtonHidden=true;
			}
			else if(rightButtonHidden){
				Ext.get('carousel-navButton-next').removeCls("hide-button");
				rightButtonHidden=false;
			}

			if(leftSlide==null){
				Ext.get('carousel-navButton-prev').addCls("hide-button");
				leftButtonHidden=true;
			}
			else if(leftButtonHidden){
				Ext.get('carousel-navButton-prev').removeCls("hide-button");
				leftButtonHidden=false;
			}

		}

		// to move the slides to right
		var prevSlide=function(){
			// or right sliding
			
			xlSlide='';
			if(extremeLeftSlide.size()>0){
				xlSlide=extremeLeftSlide.pop()
				Ext.get(xlSlide).removeCls("extreme-left-slide");
				Ext.get(xlSlide).addCls("left-slide");
			}

			Ext.get(leftSlide).removeCls("left-slide");
			Ext.get(leftSlide).addCls("center-slide");

			
			Ext.get(centerSlide).removeCls("center-slide");
			Ext.get(centerSlide).addCls("right-slide");

			if(rightSlide!=null){
				Ext.get(rightSlide).removeCls("right-slide");
				Ext.get(rightSlide).addCls("extreme-right-slide");
			}
			
			if(rightSlide!=null){
				extremeRightSlide.push(rightSlide);
			}
			rightSlide=centerSlide;

			centerSlide=leftSlide;
			updatePillState(Ext.get(centerSlide).dom.id.slice(-1));

			if(xlSlide==''){
				xlSlide=extremeLeftSlide.pop();
			}
			leftSlide=xlSlide;
			buttonCheck();

		}

		// to move the slides to left
		var nextSlide=function(){
			// or left sliding
			
			xrSlide='';
			if(extremeRightSlide.size()>0){
				xrSlide=extremeRightSlide.pop();
				Ext.get(xrSlide).removeCls("extreme-right-slide");
				Ext.get(xrSlide).addCls("right-slide");
			}
			Ext.get(rightSlide).removeCls("right-slide");
			Ext.get(rightSlide).addCls("center-slide");

			Ext.get(centerSlide).removeCls("center-slide");
			Ext.get(centerSlide).addCls("left-slide");

			if(leftSlide!=null){
				Ext.get(leftSlide).removeCls("left-slide");
				Ext.get(leftSlide).addCls("extreme-left-slide");
			}

			if(leftSlide!=null){
				extremeLeftSlide.push(leftSlide);
			}
			leftSlide=centerSlide;

			centerSlide=rightSlide;
			updatePillState(Ext.get(centerSlide).dom.id.slice(-1));

			if(xrSlide==''){
				xrSlide=extremeRightSlide.pop();
			}
			rightSlide=xrSlide;
			buttonCheck();

		}

		// a listener applied on all slides, which pauses auto scrolling
		var pauseAutoScrollingListener={
			render: function(container){
				container.el.on('mouseover',function(){
					// console.log(autoSlideChange);
					autoSlideChange=false;
				});
				container.el.on('mouseout', function () {
					// console.log(autoSlideChange);
					autoSlideChange=true;
				});
			},
			scope: this
		}

		// +======================================================================+
		// 5. Add or Remove Slides from here: 
		// 	    i. `id` should be in the format "carousel-slide-{slide_number}"
		//     ii.  add a center-slide, right-slide and a left-slide to
		// 	        the desired slides' cls
		// 	   iii. The html content will be appended in html[] of each slide component
		// +======================================================================+

		
		var slide1 = Ext.create('Ext.Component', {
			id:'carousel-slide-1',
			cls:'carousel-slide left-slide',
			html:'<h3>Component 1</h3>',
			listeners:pauseAutoScrollingListener
		});

		var slide2 = Ext.create('Ext.Component', {
			id:'carousel-slide-2',
			cls:'carousel-slide center-slide',
			html:'<h3>Component 2</h3>',
			listeners:pauseAutoScrollingListener
		});

		var slide3 = Ext.create('Ext.Component', {
			id:'carousel-slide-3',
			cls:'carousel-slide right-slide',
			html:'<h3>Component 3</h3>',
			listeners:pauseAutoScrollingListener
		});

		var slide4 = Ext.create('Ext.Component', {
			id:'carousel-slide-4',
			cls:'carousel-slide extreme-right-slide',
			html:'<h3>Component 4</h3>',
			listeners:pauseAutoScrollingListener
		});

		var slide5 = Ext.create('Ext.Component', {
			id:'carousel-slide-5',
			cls:'carousel-slide extreme-right-slide',
			html:'<h3>Component 5</h3>',
			listeners:pauseAutoScrollingListener
		});

		// +======================================================================+
		// 6. push all the remaining slides in extremeRightSlide Stack
		extremeRightSlide.push('carousel-slide-5')
		extremeRightSlide.push('carousel-slide-4')
		// +======================================================================+

		// updates pill-button state according to currentSlide
		var updatePillState=function(id){
            for (let i = 1; i <= numberOfSlides; i++) {
                if(i==id){
                    Ext.get('carousel-pill-'+i).addCls("selected-carousel-pill");
                }else{
                    Ext.get('carousel-pill-'+i).removeCls("selected-carousel-pill");
                }
			} 
		}
		// to change slides from pill-nav-bar
		var changeSlide=function(x){
			updatePillState(x);
			centerSlideID='carousel-slide-'+x;

			if(centerSlideID==centerSlide){
				return;
			}
			Ext.select('.extreme-left-slide').each(function(slide) {
				slide.removeCls('extreme-left-slide');
			});
			Ext.select('.extreme-right-slide').each(function(slide) {
				slide.removeCls('extreme-right-slide');
			});
			Ext.select('.left-slide').each(function(slide) {
				slide.removeCls('left-slide');
			});
			Ext.select('.right-slide').each(function(slide) {
				slide.removeCls('right-slide');
			});
			Ext.select('.center-slide').each(function(slide) {
				slide.removeCls('center-slide');
			});
			extremeLeftSlide.empty();
			extremeRightSlide.empty();

			Ext.get(centerSlideID).addCls("center-slide");
			centerSlide=centerSlideID;

			// if x==1 or x==numeOfSlides skip steps
			if(x!=1){
				Ext.get('carousel-slide-'+(x-1)).addCls("left-slide");
				leftSlide='carousel-slide-'+(x-1);
			}else{
				leftSlide=null;
			}

			if(x!=numberOfSlides){
				Ext.get('carousel-slide-'+(x+1)).addCls("right-slide");
				rightSlide='carousel-slide-'+(x+1);
			}else{
				rightSlide=null;
			}
			Ext.select('.carousel-slide').each(function(slide) {
				// console.log(slide.dom.id);
				slideTextID=slide.dom.id;
				slideNumID=parseInt(slide.dom.id.slice(-1));

				if(slideNumID>(x+1)){
					// console.log(slideNumID+" goes to right")
					Ext.get(slideTextID).addCls("extreme-right-slide");
					extremeRightSlide.push(slideTextID);
				}
				if(slideNumID<(x-1)){
					// console.log(slideNumID+" goes to left")
					Ext.get(slideTextID).addCls("extreme-left-slide");
					extremeLeftSlide.push(slideTextID);
				}
			});
			buttonCheck();
		}

		// Dynamically Generate Pill Buttons 
		pillButtons=[]
		for (let j = 1; j <= numberOfSlides; j++) {
			myCls = (j==2) ? 'carousel-pill selected-carousel-pill':'carousel-pill' ;
			pill=Ext.create('Ext.Button', {
				id:'carousel-pill-'+j,
				cls:myCls,
				handler: function(btn) {
					changeSlide(j);
					currentSlide=j;
				}
			});
			pillButtons.push(pill);
		}
		// Pills Container
		var navigationPillsContainer = Ext.create('Ext.container.Container', {
			id:'carousel-pills-container',
			cls:'carousel-pills-container',
			items: pillButtons
		});

		// Left/Right Navigation Buttons
		var prevButton=Ext.create('Ext.Button', {
			id:'carousel-navButton-prev',
			cls:'carousel-button carousel-button-left',
			glyph : 'f053@FontAwesome',
			handler: function(btn) {
				prevSlide();
				currentSlide--;
			},
			listeners:pauseAutoScrollingListener
		});
		var nextButton=Ext.create('Ext.Button', {
			id:'carousel-navButton-next',
			cls:'carousel-button carousel-button-right',
			glyph : 'f054@FontAwesome',
			handler: function(btn) {
				nextSlide();
				currentSlide++;
			},
			listeners:pauseAutoScrollingListener
		});

		// Main Carousel Container
		// +======================================================================+
		// 7. Add the slide1, slide2 etc. to items[] in mainContainer
		// +======================================================================+
		var mainContainer = Ext.create('Ext.container.Container', {
			renderTo: Ext.getBody(),
			id:'carousel-container',
			cls:'carousel-container',
			title: 'Container',
			border: 1,
			width: '100%',
			height: '100vh',
			padding:'5 5 5 5',
			items: [slide1,slide2,slide3,slide4,slide5,prevButton,nextButton]
		});

		// Adding Pills to Main Container
		mainContainer.add(navigationPillsContainer)

    },
    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
