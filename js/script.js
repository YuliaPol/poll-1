jQuery(function ($) {
    $(document).ready(function () {
        
        //mask 
        $('.date').mask('99.99.9999');
        
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