define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'qrz', title:'QRZ Login', moduleId: 'viewmodels/qrzlogin', nav: true },
                { route: 'upload', title:'Log Upload', moduleId: 'viewmodels/upload', nav: true },
                { route: 'map', title:'Map', moduleId: 'viewmodels/map', nav: true }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});