define(['durandal/app', 'knockout', 'plugins/http', 'jquery', 'plugins/router'],
function (app, ko, http, $, router) {
    var REDIRECT_DELAY_MS = 5000;

    var vm = {
        state: ko.observable('init'),
        username: ko.observable(),
        password: ko.observable(),
        err: ko.observable(),
        key: ko.observable(),
        login: function() {
            this.state('working');
            var that = this;
            function fail(err) {
                that.state('fail');
                that.err(err);
            }
            // connect to QRZ
            var query = {
                "password": this.password(),
                "username": this.username()
            };
            var url = "https://xmldata.qrz.com/xml/current/";
            http.get(url, query)
                .done(function(data, status, xhr) {
                    var errors = data.getElementsByTagName("Error");
                    if (errors.length){
                        fail(errors[0].textContent)
                        return;
                    }
                    that.key(data.getElementsByTagName("Key")[0].textContent)
                    that.state('done');
                    window.setTimeout(function(){router.navigate("#upload")}, REDIRECT_DELAY_MS)
                })
                .fail(function(xhr, status, err) {
                    fail(err)
                })
            ;
        }
    };

    return vm;
});