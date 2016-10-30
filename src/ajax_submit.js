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
            callbacks       =   $.extend({
                                    onstart: function() {},
                                    success: function(response) {},
                                    fail: function(response) {},
                                    done: function(response) {}
                                }, cbf);

        $(this).submit(function(e){
            e.preventDefault();
            var formData    =   new FormData($(this)[0]);
            callbacks.onstart();
            $.ajax({
                url: endpoint,
                type: method,
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: callbacks.success,
                error: callbacks.fail,
                done: callbacks.done
            });
        });
	};
 })(jQuery);
