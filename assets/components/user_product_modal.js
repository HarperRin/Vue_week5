export default {
    template: '#userProductModal',
    props: ['product'],
    data() {
        return {
            modal: {},
            qty: 1,
        };
    },
    watch: {
        id() {
            this.getProductModal(id);
        },
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal);
    },
}