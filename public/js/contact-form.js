$(function(){
    // show and hide general/press contact forms in nav
    $('.form-selection-nav button').on('click', function(e){
        if($(this).hasClass('general-inquiry-btn')){
            $('.press').addClass('hide-me');
            $('.general').removeClass('hide-me');
            $('.press-inquiry-btn').removeClass('active-btn');
            $('.general-inquiry-btn').addClass('active-btn');
            $('.enquiry-type').val('general');
        } else {
            $('.general').addClass('hide-me');
            $('.press').removeClass('hide-me');
            $('.general-inquiry-btn').removeClass('active-btn');
            $('.press-inquiry-btn').addClass('active-btn');
            $('.enquiry-type').val('press');
        }
    });
});