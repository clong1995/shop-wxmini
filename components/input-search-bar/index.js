Component({
    options: {
        addGlobalClass: true,
        multipleSlots: true,
    },
    properties: {
        hint: String,
        value: String,
        icon: String,
        color: {type: String, value: "var(--black45)"},
    },
    observers: {},
    data: {},
    methods: {
        _confirm(e) {
            const value = e.detail.value;
            this.triggerEvent('confirm', {value: value})
        }
    },
    lifetimes: {}
});
