(function ($) {
	var resizeTimer;	
    $.event.special.endresize = {
        setup: function (data, namespaces) {
            $(this).bind("resize.specialresize", $.event.special.endresize.handler);
        },
        teardown: function (namespaces) {
            $(this).unbind(".specialresize")
        },
        handler: function (event) {
			
			if (!$(this).data('resizing')){
				$(this).trigger('startresize')
				$(this).data('resizing', true);  				
				event.type = "startresize";
			}
						
			if (resizeTimer){
				clearTimeout(resizeTimer);
			}
			resizeTimer = setTimeout( function(){
				$(this).removeData('resizing');  				
				event.type = "endresize";
				$(this).trigger('endresize')
				resizeTimer = 0;
			}, 500);
			
        }
		
    };

})(jQuery);


