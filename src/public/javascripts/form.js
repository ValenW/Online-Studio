$('.signup-form').form({
    fields: {
        username : 'empty',
        email: 'email',
        password : ['minLength[6]', 'empty'],
        confirm_password: ['match[password]', 'empty']
    }
});

$('.login-form').form({
    fields: {
        username: 'empty',
        password: 'empty'
    }
});
