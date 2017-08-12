if (typeof Handlebars) {
    var BulificationTemplate    =   Handlebars.compile('<div class="message is-{{#if Colour}}{{Colour}}{{else}}dark{{/if}} bulification"><div class="message-header"><p>{{Title}}</p><button class="delete" aria-label="delete"></button></div><div class="message-body">{{{Content}}}<div class="has-text-centered actions"><a class="button is-info">OK</a></div></div></div>'),
        Bulification            =   function(title, content, colour)
        {
            this.html           =   $(BulificationTemplate({Title: title, Content: content, Colour: colour}));

            this.show           =   function()
                                    {
                                        $('body').addClass('blurred');
                                        me.html.appendTo($('body'));
                                    };

            this.close          =   function(e)
                                    {
                                        if (e) {
                                            e.preventDefault();
                                            me.html.remove();
                                            $('body').removeClass('blurred');
                                        }
                                    };

            var me              =   this;

            this.html.find('button.delete').click(this.close);
            this.html.find('a.button').click(this.close);

            return this;
        };
}

function BulmaAlert()
{
    if (!(typeof Handlebars)) {
        console.warn('To use Bulification, install http://handlebarsjs.com/ first!');
    }

    window.alert        =   function(msg, title)
    {
        if (!title) { title = 'Message'; }
        var msgbox = new Bulification(title, msg);
        msgbox.show();
    };
}
