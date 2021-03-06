/**
 * Created by jeff on 9/25/16.
 */


define('viewmodels/upload', ['plugins/http', 'durandal/app', 'jquery', 'knockout', 'dropzone', 'durandal/events', 'plugins/router', 'viewmodels/qrzlogin'],
    function (http, app, $, ko, dropzone, Events, router, qrz) {

        var REDIRECT_DELAY_MS = 1000;

        function onDZSuccess(file, response) {
            vm.filename(file.name);
            var _id = response._id; // inserted_id
            vm.qth(response.qth);
            window.setTimeout(function(){
                router.navigate('map?log=api/log/' + _id)
            }, REDIRECT_DELAY_MS)
        }

        function onDZError(file, errorMessage, xhr) {
            app.showMessage([
                "Error in file ",
                file.name,
                ": ",
                errorMessage
            ].join(''))
        }

        dropzone.options.uploadLog = {
            init: function () {
                this.on("success", onDZSuccess);
                this.on("error", onDZError);
            }
        };

        function onCompositionComplete() {
            dropzone.discover();
        }

        var vm = {
            qth: ko.observable(),
            filename: ko.observable(),
            key: qrz.key,
            state: qrz.state,
            compositionComplete: onCompositionComplete
        };

        return vm;
    });
