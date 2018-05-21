/**
 * - callbacks: null | {
        onstart: function | null,
        sucess: function | null,
        fail: function | null,
        done: function | null
     }
 * */
(function($) {
    $.fn.ajaxSubmit         =   function(cbf)
    {
        var self            =   $(this),
            endpoint        =   $(this).attr('action'),
            method          =   $(this).attr('method'),
            lockdown        =   false,
            callbacks       =   $.extend({
                                    validator: function() { return true; },
                                    onstart: function() {},
                                    success: function(response) {},
                                    fail: function(response) {},
                                    done: function(response) {}
                                }, cbf);

        $(this).submit(function(e)
        {
            e.preventDefault();
            e.stopPropagation();

            if (!callbacks.validator()) {
                return false;
            }

            if (lockdown) {
                return false;
            }

            lockdown            =   true;

            var formData        =   new FormData($(this)[0]);

            callbacks.onstart();

            if (axios) {
                console.log('using axios');
                axios.post(endpoint, formData).then(function(response)
                {
                    lockdown    =   false;
                    callbacks.success(response.data);
                }).catch(function (error)
                {
                    lockdown    =   false;
                    callbacks.fail(error.data);
                });
            } else {
                console.log('using ajax');
                $.ajax({
                    url         :   endpoint,
                    type        :   method,
                    data        :   formData,
                    cache       :   false,
                    contentType :   false,
                    processData :   false
                }).done(callbacks.success).fail(callbacks.fail).always(function(response)
                {
                    lockdown = false;
                    callbacks.done(response);
                });
            }
        });
    };
 })(jQuery);
