const check = require('../../utils/check');
Component({
    changed:false,//为了优化性能
    options: {
        multipleSlots: true,
    },
    data: {
        left: {
            height: 0,
            list: [],
        },
        right: {
            height: 0,
            list: [],
        }
    },
    properties: {
        list: {type: Array, value: []},
        gap: {type: Number, value: 12},
    },
    observers: {
        "list": function (list) {
            this.changed = false;
            list.forEach(v => {
                if (
                    this.data.left.list.find(element => element["id"] === v["id"])
                    ||
                    this.data.right.list.find(element => element["id"] === v["id"])
                ) {
                    return;
                }
                if (this.data.left.height <= this.data.right.height) {
                    this.data.left.list.push(v);
                    this.data.left.height += v.ratio;
                } else {
                    this.data.right.list.push(v);
                    this.data.right.height += v.ratio;
                }
                this.changed = true;
            })
            if(this.changed){
                //TODO 这里不该直接赋值数组，应该找下添加元素的办法
                this.setData({
                    "left.list": this.data.left.list,
                    "right.list": this.data.right.list,
                });
            }
        }
    },
    methods: {},
    lifetimes: {}
});
