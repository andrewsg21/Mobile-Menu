/* Author: Andrew Greig c/o Visual Jazz Isobar, 2012 */

var app = app || {};

// Site Menu
app.menu = (function(doc, $, undefined) {
	
	var 

	i = 0,
	x = 0,		// starting point
    dx = 0,		// distance moved
    ox = null,	// original X

    breakpoint = 768,
    menuWidth = 250,

	container = null,
	openButton = null,
	isOpen = false,

	data = {
		docHeight : null,
		docWidth : null
	},

	init = function(){
		openButton = $('.open');
		container = $(openButton.data('target'));

		getSizes();
		setSizes();
		bindings();

		// recalculate on resize
		$(window).resize(function(){
			getSizes();
			setSizes();
		});

	},

	getSizes = function(){
		data.docHeight = $(window).height();
		data.docWidth = $(window).width();
	},

	setSizes = function(){
		container.find('section').css({ 
			height : data.docHeight - 44
		});
		container.css({
			width : (data.docWidth > breakpoint ? data.docWidth - menuWidth : data.docWidth)
		});
	},

	bindings = function(){

		openButton.on('tap', function(e){
			if (!isOpen) {
				openContainer();
			} else {
				closeContainer();
			}
			e.preventDefault();
			e.stopPropagation();
		});

		// touch start when container is open
		container.on('touchstart', function(e) {
			if (isOpen) {
				e.preventDefault();
				var touch = e.targetTouches[0];
				x = container.offset().left;
			    ox = -x + touch.pageX;
			    // touch move
			    container.on('touchmove', function(e) {
					e.preventDefault();
					var touch = e.changedTouches[0];
					if(ox){
						var nx = parseInt(touch.pageX) - ox;
						dx = nx - x;
						x = nx;
						moveContainer(nx);
					}
				});
			    // touch end
				container.on('touchend', function(e) {
					ox = null;
					if(dx!=0){
						dx = 0;
						closeContainer();
					}
					container.off('touchend');
					container.off('touchmove');
				});

			}
		});

	},

	openContainer = function(){
		isOpen = true
		animateContainer(250)
	},

	closeContainer = function(){
		isOpen = false
		animateContainer(0)
	},

	moveContainer = function(x){
		if(dx!=0){
			container.css('-webkit-transform', 'translate3d(' + x +'px, 0px, 0px)')
		}
	},

	animateContainer = function(to, callback){
		container.anim({ translate3d: to + 'px, 0, 0'}, 0.3, 'ease-out')
		setTimeout(function(){
			x = container.offset().left
			//updateLog(x)
		}, 400)
	}

	return {
		init : init,
		open : open
	};
	
})(document, Zepto);

app.menu.init();

function updateLog(g) {
  $('.console').show().append(g + ' : ');
}

(function($) {
    // only do this if not on a touch device
    if (!('ontouchend' in window)) {
        $(document).delegate('body', 'click', function(e) {
            $(e.target).trigger('tap');
        });
    }
})(window.Zepto);


