/**
 * Created by jeff on 9/25/16.
 */


define('viewmodels/upload', ['plugins/http', 'durandal/app', 'jquery', 'knockout', 'dropzone', 'durandal/events', 'plugins/router', 'viewmodels/qrzlogin'],
    function (http, app, $, ko, dropzone, Events, router, qrz) {

        var REDIRECT_DELAY_MS = 1000;

        function onDZSuccess(file, response) {
            var _id = response._id; // inserted_id
            window.setTimeout(function(){
                router.navigate('/#map?log=api/log/' + _id)
            }, REDIRECT_DELAY_MS)
        }

        dropzone.options.uploadLog = {
            maxFiles: 1,
            init: function () {
                this.on("success", onDZSuccess);
            }
        };

        function onCompositionComplete() {
            dropzone.discover();
        }

        var vm = {
            key: qrz.key,
            state: qrz.state,
            compositionComplete: onCompositionComplete
        };

        return vm;
    });
