$(() => {
    $('.actions ul li').click(function() {
        $('.actions .register input').val('');
        $('.actions ul li, .actions form').removeClass('selected');
        $(this).addClass('selected');
        $(`.actions form.${$(this).attr('tabof')}`).addClass('selected');
    });

    $('.actions .signedup a').click(() => {
        $('.actions .signedup').fadeOut(1000);
        $('.actions ul li, .actions form').removeClass('selected');
        $('.actions ul [tabof="login"]').addClass('selected');
        $(`.actions form.login`).addClass('selected');
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
                location.href = '/home';
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
            if (data.success) {
                $('.actions .login #username').val($(this.username).val());
                $('.actions .login #password').val('');
                $(`.actions form, .actions ul li`).removeClass('selected');
                $('.actions .signedup').fadeIn(1000);
            } else {
                $(this).find('.form-error').text(data.reason);
            }
        });
    });
    
});