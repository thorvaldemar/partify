$(() => {
    $('.actions ul li').click(function() {
        $('.actions ul li').removeClass('selected');
        $(this).addClass('selected');
        $(`.actions form`).removeClass('selected');
        $(`.actions form.${$(this).attr('tabof')}`).addClass('selected');
    });

    $.getJSON('/public/countries.json', data => {
        data.forEach(e => {
            $('.actions .register #country').append(`<option value="${e.code}">${e.name}</option>`);
        });
    });

    $('.actions .login').submit(function(e) {
        e.preventDefault();
        nodeCall('/login', [
            $(this.username).val(),
            $(this.password).val()
        ], data => {
            if (!data.success) {
                $(this).find('.form-error').text("Incorrect username or password");
            } else {
                // TODO: send to home
            }
        });
    });

    $('.actions .register').submit(function(e) {
        e.preventDefault();
        nodeCall('/register', [
            $(this.username).val(),
            $(this.password).val(),
            $(this.mail).val(),
            $(this.country).val()
        ], data => {
            if (!data.success) {
                $(this).find('.form-error').text(data.reason);
            }
        });
    });
    
});