/**
 * Created by jeff on 9/25/16.
 */


define('viewmodels/upload', ['plugins/http', 'durandal/app', 'jquery', 'knockout', 'dropzone', 'durandal/events', 'plugins/router'],
    function (http, app, $, ko, dropzone, Events, router) {

        //var REDIRECT_DELAY_MS = 3000;
        //
        //function onDZSuccess() {
        //    window.setTimeout(function(){router.navigate("#Identity")}, REDIRECT_DELAY_MS)
        //}

        function onCompositionComplete() {
            //dropzone.options.uploadProfilePicture = {
            //    maxFiles: 1,
            //    init: function () {
            //        this.on("success", onDZSuccess);
            //    }
            //};
            dropzone.discover();
        }

        var vm = {
            compositionComplete: onCompositionComplete
        };

        return vm;

    });

