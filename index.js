const rule = require('./src/rule')
const regular = require('./src/regular');

const v = {
    extendRule: {},
    rule(name, sign = "") {
        return {
            test(...args) {
                return () => {
                    return (rule[name] || v.extendRule[name])(...args).catch((tips = "") => {
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
        return Object.assign({ extendRule: Object.assign({}, v.extendRule, rule) }, v);
    }
}

module.exports = v;
exports.rule = rule;
exports.regular = regular;