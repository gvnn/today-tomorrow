;(function($){

    var DROPBOX_APP_KEY = 'r4ceqin76u8k0iy';
    var MIN_HEIGHT = 300;

    listItemPartial =   '<li data-index="{{i}}"><div class="list-item-container">' +
                            '<div' +
                                ' proxy-tap="edit"' +
                                ' class="description {{( completed ? \'completed\' : \'\' )}}">' +
                                '{{ description }}' +
                            '</div>' +
                            '{{#.editing}}' +
                            '<div proxy-click="unedit" class="edit-container">' +
                                ' <a proxy-click="complete:{{i}}">{{( completed ? \'Not Done\' : \'Done\' )}}</a>' +
                                ' <a proxy-click="move:{{( date == todayDate() ? \'tomorrow\' : \'today\' )}}">{{( date == todayDate() ? \'Tomorrow\' : \'Today\' )}}</a>' +
                                ' <a proxy-click="forget:{{i}}">Delete</a>' +
                            '</div>' +
                            '{{/.editing}}' +
                        '</div></li>';

    var translations = {
        en: { name: "English", today: "Today", tomorrow: "Tomorrow"},
        af: { name: "Afrikaans", today: "Vandag", tomorrow: "m&#244;re"},
        sq: { name: "Albanian", today: "sot", tomorrow: "nes&#235;r"},
        ar: { name: "Arabic", dir: "rtl", today: "&#1575;&#1604;&#1610;&#1608;&#1605;", tomorrow: "&#1594;&#1583;&#1575;"},
        be: { name: "Belarusian", today: "&#1089;&#1105;&#1085;&#1085;&#1103;", tomorrow: "&#1079;&#1072;&#1118;&#1090;&#1088;&#1072;"},
        bs: { name: "Bosnian", today: "danas", tomorrow: "sutra"},
        bg: { name: "Bulgarian", today: "&#1076;&#1085;&#1077;&#1089;", tomorrow: "&#1091;&#1090;&#1088;&#1077;"},
        ca: { name: "Catalan", today: "avui", tomorrow: "dem&#224;"},
        zh: { name: "Chinese", today: "&#20170;&#22825;", tomorrow: "&#26126;&#22825;"},
        hr: { name: "Croatian", today: "danas", tomorrow: "sutra"},
        cs: { name: "Czech", today: "dnes", tomorrow: "z&#237;tra"},
        da: { name: "Danish", today: "i dag", tomorrow: "i morgen"},
        nl: { name: "Dutch", today: "vandaag", tomorrow: "morgen"},
        et: { name: "Estonian", today: "t&#228;na", tomorrow: "homme"},
        fi: { name: "Finnish", today: "t&#228;n&#228;&#228;n", tomorrow: "huomenna"},
        fr: { name: "French", today: "aujourd'hui", tomorrow: "demain"},
        gl: { name: "Galician", today: "hoxe", tomorrow: "ma&#241;&#225;"},
        de: { name: "German", today: "heute", tomorrow: "morgen"},
        el: { name: "Greek", today: "&#963;&#942;&#956;&#949;&#961;&#945;", tomorrow: "&#945;&#973;&#961;&#953;&#959;"},
        ht: { name: "Haitian", today: "jodi a", tomorrow: "demen"},
        he: { name: "Hebrew", dir: "rtl", today: "&#1492;&#1497;&#1493;&#1501;", tomorrow: "&#1502;&#1495;&#1512;"},
        hi: { name: "Hindi", today: "&#2310;&#2332;", tomorrow: "&#2325;&#2354;"},
        hu: { name: "Hungarian", today: "ma", tomorrow: "holnap"},
        is: { name: "Icelandic", today: "&#237; dag", tomorrow: "morgun"},
        id: { name: "Indonesian", today: "hari ini", tomorrow: "besok"},
        ga: { name: "Irish", today: "l&#225; at&#225; inniu ann", tomorrow: "am&#225;rach"},
        it: { name: "Italian", today: "oggi", tomorrow: "domani"},
        ja: { name: "Japanese", today: "&#20170;&#26085;", tomorrow: "&#26126;&#26085;"},
        ko: { name: "Korean", today: "&#50724;&#45720;", tomorrow: "&#45236;&#51068;"},
        lv: { name: "Latvian", today: "&#353;odien", tomorrow: "r&#299;t"},
        lt: { name: "Lithuanian", today: "&#353;iandien", tomorrow: "rytoj"},
        mk: { name: "Macedonian", today: "&#1076;&#1077;&#1085;&#1077;&#1089;", tomorrow: "&#1091;&#1090;&#1088;&#1077;"},
        ms: { name: "Malay", today: "hari ini", tomorrow: "esok"},
        mt: { name: "Maltese", today: "llum", tomorrow: "g&#295;ada"},
        mo: { name: "Moldavian", today: "azi", tomorrow: "m&#226;ine"},
        no: { name: "Norwegian", today: "i dag", tomorrow: "i morgen"},
        fa: { name: "Persian", dir: "rtl", today: "&#1575;&#1605;&#1585;&#1608;&#1586;", tomorrow: "&#1601;&#1585;&#1583;&#1575;"},
        pl: { name: "Polish", today: "dzisiaj", tomorrow: "jutro"},
        pt: { name: "Portuguese", today: "hoje", tomorrow: "amanh&#227;"},
        ro: { name: "Romanian", today: "azi", tomorrow: "m&#226;ine"},
        ru: { name: "Russian", today: "&#1089;&#1077;&#1075;&#1086;&#1076;&#1085;&#1103;", tomorrow: "&#1079;&#1072;&#1074;&#1090;&#1088;&#1072;"},
        sr: { name: "Serbian", today: "&#1076;&#1072;&#1085;&#1072;&#1089;", tomorrow: "&#1089;&#1091;&#1090;&#1088;&#1072;"},
        sk: { name: "Slovak", today: "dnes", tomorrow: "zajtra"},
        sl: { name: "Slovenian", today: "danes", tomorrow: "jutri"},
        es: { name: "Spanish", today: "hoy", tomorrow: "ma&#241;ana"},
        sw: { name: "Swahili", today: "leo", tomorrow: "kesho"},
        sv: { name: "Swedish", today: "i dag", tomorrow: "i morgon"},
        tl: { name: "Tagalog", today: "ngayon", tomorrow: "bukas"},
        th: { name: "Thai", today: "&#3623;&#3633;&#3609;&#3609;&#3637;&#3657;", tomorrow: "&#3623;&#3633;&#3609;&#3614;&#3619;&#3640;&#3656;&#3591;&#3609;&#3637;&#3657;"},
        tr: { name: "Turkish", today: "bug&#252;n", tomorrow: "yar&#305;n"},
        uk: { name: "Ukrainian", today: "&#1089;&#1100;&#1086;&#1075;&#1086;&#1076;&#1085;&#1110;", tomorrow: "&#1079;&#1072;&#1074;&#1090;&#1088;&#1072;"},
        vi: { name: "Vietnamese", today: "h&#244;m nay", tomorrow: "mai"},
        cy: { name: "Welsh", today: "heddiw", tomorrow: "yfory"},
        yi: { name: "Yiddish", dir: "rtl", today: "&#1492;&#1497;&#1497;&#1463;&#1504;&#1496;", tomorrow: "&#1502;&#1488;&#1464;&#1512;&#1490;&#1503;"}
    };

    var module = {};
    module.ractive = null;
    module.client = null;
    module.defaultTheme = "white-cyan";
    module.options = {
        selectedTheme: module.defaultTheme,
        randomLanguage: false,
        exists: false
    };
    module.lang = translations.en;

    module.getToday = function(){
        var d = new Date();
        d.setHours(0,0,0,0);
        return d;
    };

    module.getTomorrow = function(){
        var tomorrow = new Date();
        tomorrow.setDate(module.getToday().getDate()+1);
        tomorrow.setHours(0,0,0,0);
        return tomorrow;
    };

    var randomLanguage = function () {
        var keys = Object.keys(translations);
        return translations[keys[ keys.length * Math.random() << 0]];
    };

    var languagesList = function(){
        var list = [];
        var keys = Object.keys(translations);
        for (var i = 0; i < keys.length; i++) {
            list.push({
                name: translations[keys[i]].name,
                code: keys[i]
            });
        }
        return list;
    };

    var loadUserInfo = function(ractiveInstance){
        module.client.getUserInfo(
            function(err, obj){
                ractiveInstance.set({
                    user: obj,
                    signedIn: true,
                    notSignedIn: false
                });
                $("#todo").animate({ opacity: 1 });
            }
        );
    };

    var resizeBoxes = function() {
        var minHeight = $(window).height() / 2;
        $("#todayContainer").css('min-height', minHeight < MIN_HEIGHT ? MIN_HEIGHT : minHeight);
        $("#tomorrowContainer").css('min-height', minHeight < MIN_HEIGHT ? MIN_HEIGHT : minHeight);
    };

    var signOff = function() {
        module.client.signOff();
        module.ractive.set({
            signedIn: false,
            notSignedIn: true
        });
        $("#connect").animate({ opacity: 1 }, {
            complete: function(){
                $('#connect').on('click', 'a', function(e){
                    e.preventDefault();
                    module.client.authenticate();
                });
            }
        });
    };

    var loadTasks = function(date){
        var tasks = module.taskTable.query({ date: date });
        var result = [];
        for (var i = 0; i < tasks.length; i++) {
            result.push({
                ID: tasks[i].getId(),
                description: tasks[i].get("description"),
                completed: tasks[i].get("completed"),
                editing: tasks[i].get("editing"),
                date: tasks[i].get("date"),
                position: tasks[i].get("position")
            });
        }
        result.sort(function(a,b){return a.position-b.position;});
        return result;
    };

    var linkDataUpdates = function(ractiveInstance){
        module.taskTable = module.datastore.getTable('tasks');
        bumpTasks();

        var todayItems = loadTasks(module.getToday());
        var tomorrowItems = loadTasks(module.getTomorrow());

        ractiveInstance.set({
            loadingInfo: false,
            todayItems: todayItems,
            tomorrowItems: tomorrowItems
        });
    };

    var loadOptions = function(callback){
        if (module.client.isAuthenticated()) {
            var datastoreManager = module.client.getDatastoreManager();
            datastoreManager.openDefaultDatastore(function (error, datastore) {

                module.datastore = datastore;

                module.optionsTable = datastore.getTable('options');

                var options = module.optionsTable.query({});
                if (options.length > 0) {
                    module.options.selectedTheme = options[0].get("selectedTheme");
                    module.options.randomLanguage = options[0].get("randomLanguage");
                    module.options.exists = true;
                }

                if (module.options.randomLanguage) {
                    module.lang = randomLanguage();
                }

                module.datastore.recordsChanged.addListener(function (event) {
                    if (!event._local) {
                        showRefresh();
                    }
                });

                if (callback) {
                    callback();
                }

            });
        } else {
            if (callback) {
                callback();
            }
        }
    };

    var showRefresh = function(){
        $(".update").show();
    };

    var setOption = function(option, value){
        if (module.options.exists) {
            var options = module.optionsTable.query({});
            options[0].set(option, value);
        } else {
            var newOptions = {};
            newOptions[option] = value;
            module.optionsTable.insert(newOptions);
            module.options.exists = true;
        }
    };

    var addItemToDropbox = function(task){
        return module.taskTable.insert(task);
    };

    var resetPositions = function(itemsArray) {
        for (var i = 0; i < itemsArray.length; i++) {
            if (itemsArray[i].position != i) {
                itemsArray[i].position = i;
                module.taskTable.get(itemsArray[i].ID).set('position', i);
            }
        }
    };

    var unselectAllItems = function(){
        for (var i = 0; i < module.ractive.data.todayItems.length; i++) {
            module.ractive.data.todayItems[i].editing = false;
        }
        for (var k = 0; k < module.ractive.data.tomorrowItems.length; k++) {
            module.ractive.data.tomorrowItems[k].editing = false;
        }
        module.ractive.update();
    };

    var bumpTasks = function(){
        // get all uncompleted tasks... unfortunately dropbox datastore beta doesn't let more advance queries
        var tasks = module.taskTable.query({ completed: false });
        var todayDate = module.getToday();
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            if (task.get("date") < todayDate) {
                task.set("date", todayDate);
            }
        }
    };

    var loadRactive = function(){
        module.ractive = new Ractive({
            el: '#app',
            partials: {
                listItem: listItemPartial
            },
            template: '#template',
            data: {
                user: null,
                loadingInfo: true,
                signedIn: false,
                notSignedIn: false,
                addingToday: false,
                addingTomorrow: false,
                todayItems: [],
                tomorrowItems: [],
                themes: [
                    'white-cyan',
                    'grey-black',
                    'white-pink',
                    'white-blue',
                    'white',
                    'blue',
                    'black',
                    'green'
                ],
                selectedTheme: module.options.selectedTheme,
                randomLanguage: module.options.randomLanguage,
                languages: languagesList(),
                minHeight: function(){
                    var minHeight = $(window).height() / 2;
                    return minHeight < MIN_HEIGHT ? MIN_HEIGHT : minHeight;
                },
                today: function(){
                    return module.lang.today;
                },
                tomorrow: function(){
                    return module.lang.tomorrow;
                },
                todayDate: function(){
                    return module.getToday().toString();
                },
                dir: function(){
                    return module.lang.dir ? module.lang.dir : "ltr";
                }
            },
            complete: function(){
                if (module.client.isAuthenticated()) {
                    loadUserInfo(this);
                    linkDataUpdates(this);
                } else {
                    this.set({
                        signedIn: false,
                        notSignedIn: true,
                        loadingInfo: false
                    });
                    $("#connect").animate({ opacity: 1 }, {
                        complete: function(){
                            $('#connect').on('click', 'a', function(e){
                                e.preventDefault();
                                module.client.authenticate();
                            });
                        }
                    });
                }
            }
        });

        module.ractive.on({
            disconnect: function(){
                ga('send', 'event', 'disconnect');
                signOff();
            },
            edit: function(event) {
                unselectAllItems();
                this.set(event.keypath + '.editing', true);
                this.update();
            },
            unedit: function(event) {
                this.set(event.keypath + '.editing', false);
            },
            forget: function(event) {
                module.taskTable.get(this.get(event.keypath + '.ID')).deleteRecord();
                if(event.keypath.indexOf("todayItems") >= 0) {
                    this.data.todayItems.splice(event.index.i, 1);
                    resetPositions(this.data.todayItems);
                } else {
                    this.data.tomorrowItems.splice(event.index.i, 1);
                    resetPositions(this.data.tomorrowItems);
                }
            },
            complete: function(event){
                ga('send', 'event', 'complete');
                var task = this.get(event.keypath);
                task.completed = !task.completed;
                // dropbox update
                module.taskTable.get(task.ID).set('completed', task.completed);
                this.update();
            },
            textboxEscape: function(event){
                if (event.original.keyCode == 27) {
                    ga('send', 'event', 'textboxEscape');
                    $(event.node).blur();
                }
            },
            toggleMenu: function(event) {
                $("#menu").toggleClass('active');
            },
            move: function(event, direction){
                ga('send', 'event', 'move', direction);
                var task = this.get(event.keypath);
                task.date = (direction == "tomorrow" ? module.getTomorrow() : module.getToday());
                task.position =  (direction == "tomorrow" ? this.data.tomorrowItems.length : this.data.todayItems.length);
                task.editing = false;
                module.taskTable.get(task.ID).update(task);
                // push and splice
                if(direction == "tomorrow") {
                    this.data.todayItems.splice(event.index.i, 1);
                    resetPositions(this.data.todayItems);
                    this.data.tomorrowItems.push(task);
                } else {
                    this.data.tomorrowItems.splice(event.index.i, 1);
                    resetPositions(this.data.tomorrowItems);
                    this.data.todayItems.push(task);
                }
                this.update();
            },
            add: function(event, section){
                ga('send', 'event', 'add', section);
                unselectAllItems();
                switch(section){
                    case "today":
                        if(!module.ractive.data.addingToday) {
                            module.ractive.set({
                                addingToday: true
                            });
                            $("#newTodayInput").focus().animate({
                                width: 300,
                                opacity: 1
                            });
                        }
                        break;
                    case "tomorrow":
                        if(!module.ractive.data.addingTomorrow) {
                            module.ractive.set({
                                addingTomorrow: true
                            });
                            $("#newTomorrowInput").focus().animate({
                                width: 300,
                                opacity: 1
                            });
                        }
                        break;
                }
            },
            cancelAdd: function(event, section){
                ga('send', 'event', 'cancelAdd', section);
                switch(section){
                    case "today":
                        if(module.ractive.data.addingToday) {
                            $("#newTodayInput").animate({
                                width: 175,
                                opacity: 0
                            }, function(){
                                module.ractive.set({
                                    addingToday: false
                                });
                            }).val("");
                        }
                        break;
                    case "tomorrow":
                        if(module.ractive.data.addingTomorrow) {
                            $("#newTomorrowInput").animate({
                                width: 175,
                                opacity: 0
                            }, function(){
                                module.ractive.set({
                                    addingTomorrow: false
                                });
                            }).val("");
                        }
                        break;
                }
            },
            addNew: function(event, section){
                ga('send', 'event', 'addNew', section);
                var newTask = {
                    description: event.node.value,
                    completed: false,
                    editing: false,
                    date: section == "today" ? module.getToday() : module.getTomorrow(),
                    position: section == "today" ? module.ractive.data.todayItems.length : module.ractive.data.tomorrowItems.length
                };
                newTask.ID = addItemToDropbox(newTask).getId();
                if (section == "today") {
                    module.ractive.data.todayItems.push(newTask);
                } else {
                    module.ractive.data.tomorrowItems.push(newTask);
                    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                }
                event.node.value = "";
            },
            completed: function(event) {
                this.set(event.keypath + ".completed", !this.get(event.keypath + ".completed"));
            },
            changeTheme: function(event, index) {
                this.set("selectedTheme", this.data.themes[index]);
                setOption("selectedTheme", this.data.themes[index]);
            },
            random: function(event, action){
                this.set("randomLanguage", (action == "on"));
                setOption("randomLanguage", (action == "on"));
            }
        });
    };

    module.init = function(){

        $(window).resize(resizeBoxes);
        resizeBoxes();

        module.client = new Dropbox.Client({key: DROPBOX_APP_KEY});

        module.client.authenticate({interactive:false}, function (error) {
            if (error) {
                alert('Authentication error: ' + error);
            }
        });

        loadOptions(loadRactive);
    };

    $.extend($.fn, {
        todayTomorrow: module
    });

})(jQuery);

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-43273123-1', 'herokuapp.com');
ga('send', 'pageview');

$(function($){
    // if (window.location.protocol != "https:") {
    //    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    // } else {
        $.fn.todayTomorrow.init();

        $("#refresh").click(function(){
            top.location.reload();
        });
    // }
});