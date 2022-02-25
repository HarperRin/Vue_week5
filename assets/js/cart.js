import userProductModal from '../components/user_product_modal.js';

//VeeValidate表單驗證元件匯入，因為套件沒有支援ESM，所以要用CDN方式載入
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;  //解構形式，把函式從VeeValidate取出使用
const { required, email, min, max } = VeeValidateRules;   //加入特定規則
const { localize, loadLocaleFromURL } = VeeValidateI18n;  //引入localize, loadLocaleFromURL兩個函式來使用

defineRule('required', required);  //defineRule是VeeValidate裡面定義的函式，用來定義規則，'required'參數是自己命名的，required參數是來自const { required, email, min, max } = VeeValidateRules;
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('../assets/zh_TW.json'); //VeeValidateI18n為套件，用來載入、讀取zh_TW.json中文字檔

// Activate the locale
configure({ // 用來做一些設定
    generateMessage: localize('zh_TW'), //啟用 locale的語系設定
    validateOnInput: true, // 當使用者一輸入字元，就立即進行欄位驗證，不要一輸入就驗證也可以註解掉
});

const url = 'https://vue3-course-api.hexschool.io/v2';
const path = 'hlin-hexschool';

Vue.createApp({
    data() {
        return {
            isLoadingItem: '',    //套用在特定按鈕上
            products: [],
            product: {},
            cartData: {
                carts: []
            },
            formData: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    components: {
        VForm: Form,   //VForm是自己取名的，內容是來自const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;裡面的Form
        VField: Field,
        ErrorMessage: ErrorMessage,
    },
    methods: {
        getProducts() {
            const api = `${url}/api/${path}/products/all`;
            axios.get(api)
                .then((res) => {
                    this.addLoading();
                    this.products = res.data.products;
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        getProductModal(id) {
            const api = `${url}/api/${path}/product/${id}`;
            this.isLoadingItem = id;
            axios.get(api)
                .then((res) => {
                    this.product = res.data.product;
                    this.$refs.userProductModal.openModal();
                    this.isLoadingItem = '';
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        getCart() {
            const api = `${url}/api/${path}/cart`;
            axios.get(api)
                .then((res) => {
                    this.cartData = res.data.data;
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        addToCart(id, qty = 1) {
            const api = `${url}/api/${path}/cart`;
            const cartData = {
                product_id: id,
                qty,
            };
            this.isLoadingItem = id;
            this.$refs.userProductModal.hideModal();
            axios.post(api, { data: cartData })
                .then((res) => {
                    alert(res.data.message);
                    this.isLoadingItem = '';
                    this.addLoading();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        removeCartItem(id) {
            const api = `${url}/api/${path}/cart/${id}`;
            this.isLoadingItem = id;
            axios.delete(api)
                .then((res) => {
                    alert(res.data.message);
                    this.isLoadingItem = '';
                    this.addLoading();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        deleteCartAll() {
            const api = `${url}/api/${path}/carts`;
            axios.delete(api)
                .then((res) => {
                    alert(res.data.message);
                    this.addLoading();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        updateCartItem(item) {
            const api = `${url}/api/${path}/cart/${item.id}`;
            const cartData = {
                product_id: item.id,
                qty: item.qty,
            };
            this.isLoadingItem = item.id;
            axios.put(api, { data: cartData })
                .then((res) => {
                    alert(res.data.message);
                    this.isLoadingItem = '';
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                    this.isLoadingItem = '';
                });
        },
        createOrder() {
            const api = `${url}/api/${path}/order`;
            axios.post(api, { data: this.formData })
                .then((res) => {
                    alert(res.data.message);
                    this.addLoading();
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch((err) => {
                    alert(err.data.message);
                });
        },
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/;
            return phoneNumber.test(value) ? true : '電話 須為正確的電話號碼';
        },
        addLoading() {
            let loader = this.$loading.show({
                // Optional parameters
                container: this.fullPage ? null : this.$refs.formContainer,
                canCancel: true,
                onCancel: this.onCancel,
            });
            // simulate AJAX
            setTimeout(() => {
                loader.hide();
            }, 800);
        },
    },
    mounted() {
        this.getProducts();
        this.getCart();
    },
})

.use(VueLoading.Plugin)
.component('userProductModal', userProductModal)
.mount('#app');
