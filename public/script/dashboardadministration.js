$("document").ready(function () {
    function getGuild() {
        var re = /\/dashboard\/([\d]+)/mg;
        var url = window.location.href;
        var result = re.exec(url);
        var id = result[1];

        return id;
    }

    $('#save-reward-opts').on('click', e => {
        console.log(1);
        var button = $(e.target);
        button.prop('disabled', true);

        var payload = "test";

        var id = getGuild();
        console.log(id);

        superagent.post(`/dashboard/${id}/generalsettings/submitprefix`)
            .send(payload)
            .end(err => {
                button.prop('disabled', false);
                if (err) {
                    console.log(err);
                } else {
                    console.log('no error');
                }
            });
    });
});
