const check = require('../../utils/check');
Component({
    options: {
        multipleSlots: true
    },
    properties: {
        title: String,
        color: {type: String, value: "black"},
        padding: {type: String, value: "0 0"},
    },
    observers: {
        /*"title": function (sp) {
            check.isEmpty(sp) && console.error("title不得为空");
        }*/
    },
    data: {},
    methods: {}
});
