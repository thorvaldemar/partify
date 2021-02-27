$(() => {
    setTimeout(() =>
        $('body').css('transition', 'background-color 1s, color 1s')
        .find('*').css('transition', 'background-color 0.7s, color 0.7s'),
    100);
    

    $('header #back').click(() => location.href = '/');

    $('.settings form').submit(e => e.preventDefault());

    $(`.settings .theme [theme="${theme()}"]`).addClass('selected');
    $('.settings .theme [theme]').click(function() {
        $('.settings .theme [theme]').removeClass('selected');
        $(this).addClass("selected");
        localStorage.setItem('theme', $(this).attr('theme'));
        $('body').attr('theme', $(this).attr('theme'));
    });
});