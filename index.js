const rule = require('./src/rule')
const regular = require('./src/regular');

const v = {
    extendRule: {},
    rule(name, sign = "") {
        if (typeof name !== 'string' || typeof sign !== 'string') throw new Error("name and sign need type string");
        const that = this;
        return {
            test(...args) {
                return () => {
                    return (rule[name] || that.extendRule[name])(...args).catch((tips = "") => {
                        throw {
                            rule: name,
                            sign,
                            args,
                            tips
                        };
                    });
                }
            }
        }
    },
    exec(actions, cb) {
        p(0);
        function p(i) {
            if (actions[i] === undefined) return cb();
            actions[i]().then(() => p(i + 1)).catch(cb);
        }
    },
    asyncExec(actions, cb) {
        Promise.all(actions.map(action => action())).then(() => cb()).catch(cb);
    },
    allExec(actions, cb) {
        Promise.all(actions.map(action => action().catch(err => err))).then(results => {
            let rejects = results.filter(result => result !== undefined);
            cb(rejects.length === 0 ? undefined : rejects);
        });
    },
    extend(rule) {
        return Object.assign({}, this, { extendRule: Object.assign({}, this.extendRule, rule) });
    }
}

module.exports = v;
exports.rule = rule;
exports.regular = regular;