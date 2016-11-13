/**
 * - callbacks: null | {
        onstart: function | null,
        sucess: function | null,
        fail: function | null,
        done: function | null
     }
 * */
(function($) {
	$.fn.ajaxSubmit = function(cbf) {
        var self            =   $(this),
            endpoint        =   $(this).attr('action'),
            method          =   $(this).attr('method'),
			lockdown		=	false,
            callbacks       =   $.extend({
									validator: function() { return true; },
                                    onstart: function() {},
                                    success: function(response) {},
                                    fail: function(response) {},
                                    done: function(response) {}
                                }, cbf);

        $(this).submit(function(e){
            e.preventDefault();
			e.stopPropagation();
			
			if (!callbacks.validator()) {
				return false;
			}

			if (lockdown) {
				return false;
			}

			lockdown = true;
            var formData    =   new FormData($(this)[0]);
            callbacks.onstart();
            $.ajax({
                url: endpoint,
                type: method,
                data: formData,
                cache: false,
                contentType: false,
                processData: false
            }).done(callbacks.success).fail(callbacks.fail).always(function(response) {
				lockdown = false;
				callbacks.done(response);
			});
        });
	};
 })(jQuery);
