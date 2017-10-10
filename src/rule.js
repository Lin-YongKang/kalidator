const regular = require('./regular');

const resolve = Promise.resolve.bind(Promise);
const reject = Promise.reject.bind(Promise);

module.exports = {
    phone(phone) {
        return regular.phone.test(phone) ? resolve() : reject("手机号错误");
    }
}