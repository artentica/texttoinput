function centerMain() {
    var footer = $('footer');
    var header = $('header');
    var main = $('main');
    //var window = $(window);

    var taken = header.outerHeight(true) + footer.outerHeight(true);
    var availableHeight = $(window).height() - main.outerHeight() - taken;
    console.log($(window).height());
    main.css('top', availableHeight > 0 ? availableHeight / 2 : 0);
}

$(window).on('resize load', function() {
    centerMain();
});
