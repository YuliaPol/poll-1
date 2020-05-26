jQuery(function ($) {
    $(document).ready(function () {
        
        //mask 
        $('.date').mask('99.99.9999');
        $('.phone').ForceNumericOnly();
        $('.textarea-group textarea').focusin( function(){
            $(this).parents('.textarea-group').addClass('focus-mode');
        });
        $('.textarea-group textarea').focusout( function(){
            $(this).parents('.textarea-group').removeClass('focus-mode');
        });
        $(".autoresizing").keyup(function(e) {
            while($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
                $(this).height($(this).height()+1);
            };
        });

        $('.questions-group textarea').focusin( function(){
            $(this).parents('.textarea-cont').addClass('focus-mode');
        });
        $('.questions-group textarea').focusout( function(){
            $(this).parents('.textarea-cont').removeClass('focus-mode');
        });
        $('.audio-upload').click( function(){
            $('.file-audio').click();
        });
        $('.video-upload').click( function(){
            $('.file-video').click();
        });
        $('.image-upload').click( function(){
            $('.file-image').click();
        });
        $('.file-image').change( function(){
            console.log(this.files[0].name);
            $('.image-name').html(this.files[0].name);
        });
        $('.file-video').change( function(){
            $('.video-name').html(this.files[0].name);
        });
        $('.file-audio').change( function(){
            $('.audio-name').html(this.files[0].name);
            $('.audio-cont img').attr('src', './img/audio-active.png');
        });
    });
});
jQuery.fn.ForceNumericOnly =
function()
{
    return this.each(function()
    {
        $(this).keydown(function(e)
        {
            var max = 15;
            if ($('.phone').val().length > max) {
                $('.phone').val($('.phone').val().substr(0, max));
            }
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
            // home, end, period, and numpad decimal
            return (
                key == 8 || 
                key == 9 ||
                key == 13 ||
                key == 46 ||
                key == 110 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        });
    });
};