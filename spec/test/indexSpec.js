const v = require('../../index');

const pp = 12345678912;
const jp = 1234567891;
const phoneTips = "手机号错误";
const phoneNotThrough = {
    rule: 'phone',
    sign: 'iphone',
    args: [jp],
    tips: phoneTips
}
const timeOutNotThrough = {
    rule: 'timeOut',
    sign: 'timeOut',
    args: [false],
    tips: 'reject'
}
jasmine.DEFAULT_TIMEOUT_INTERVAL = 1500;


describe("exec", () => {
    it("through", () => {
        v.exec([
            v.rule('phone', 'iphone').test(pp)
        ], result => {
            expect(result).toBeUndefined();
        });
    });
    it("not through", () => {
        v.exec([
            v.rule('phone', 'iphone').test(jp)
        ], result => {
            expect(result).toEqual(phoneNotThrough);
        });
    });
});

describe("asyncExec", () => {
    it("through", () => {
        v.asyncExec([
            v.rule('phone', 'iphone').test(pp)
        ], result => {
            expect(result).toBeUndefined();
        });
    });
    it("not through", () => {
        v.asyncExec([
            v.rule('phone', 'iphone').test(jp)
        ], result => {
            expect(result).toEqual(phoneNotThrough);
        });
    });
});

describe("allExec", () => {
    it("through", () => {
        v.allExec([
            v.rule('phone', 'iphone').test(pp)
        ], result => {
            expect(result).toBeUndefined();
        });
    });
    it("not through", () => {
        v.allExec([
            v.rule('phone', 'iphone').test(jp)
        ], result => {
            expect(result).toEqual([phoneNotThrough]);
        });
    });
});

describe("extend", () => {
    let rule = {
        timeOut(bol) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    bol ? resolve() : reject("reject");
                }, 1000);
            })
        }
    };
    const ve = v.extend(rule);

    it("extendRule", () => {
        expect(v.extendRule).toEqual({});
        expect(ve.extendRule).toEqual(rule);
    });

    describe("exec", () => {
        it("through", () => {
            ve.exec([
                ve.rule('timeOut', 'timeOut').test(true),
                ve.rule('phone', 'iphone').test(pp)
            ], result => {
                expect(result).toBeUndefined();
            });
        });
        it("not through timeOut", () => {
            ve.exec([
                ve.rule('timeOut', 'timeOut').test(false),
                ve.rule('phone', 'iphone').test(pp)
            ], result => {
                expect(result).toEqual(timeOutNotThrough);
            });
        });
        it("not through phone", () => {
            ve.exec([
                ve.rule('timeOut', 'timeOut').test(true),
                ve.rule('phone', 'iphone').test(jp)
            ], result => {
                expect(result).toEqual(phoneNotThrough);
            });
        });
        it("not through both", () => {
            ve.exec([
                ve.rule('timeOut', 'timeOut').test(false),
                ve.rule('phone', 'iphone').test(jp)
            ], result => {
                expect(result).toEqual(timeOutNotThrough);
            });
        });
    });

    describe("asyncExec", () => {
        it("through", (done) => {
            ve.asyncExec([
                ve.rule('timeOut', 'timeOut').test(true),
                ve.rule('phone', 'iphone').test(pp)
            ], result => {
                expect(result).toBeUndefined();
                done();
            });
        });
        it("not through timeOut", (done) => {
            ve.asyncExec([
                ve.rule('timeOut', 'timeOut').test(false),
                ve.rule('phone', 'iphone').test(pp)
            ], result => {
                expect(result).toEqual(timeOutNotThrough);
                done();
            });
        });
        it("not through phone", (done) => {
            ve.asyncExec([
                ve.rule('timeOut', 'timeOut').test(true),
                ve.rule('phone', 'iphone').test(jp)
            ], result => {
                expect(result).toEqual(phoneNotThrough);
                done();
            });
        });
        it("not through both", (done) => {
            ve.asyncExec([
                ve.rule('timeOut', 'timeOut').test(false),
                ve.rule('phone', 'iphone').test(jp)
            ], result => {
                expect(result).toEqual(phoneNotThrough);
                done();
            });

        });
    });




    describe("allExec", () => {
        it("through", () => {
            ve.allExec([
                ve.rule('timeOut', 'timeOut').test(true),
                ve.rule('phone', 'iphone').test(pp)
            ], result => {
                expect(result).toBeUndefined();
            });
        });
        it("not through timeOut", (done) => {
            ve.allExec([
                ve.rule('timeOut', 'timeOut').test(false),
                ve.rule('phone', 'iphone').test(pp)
            ], result => {
                expect(result).toEqual([timeOutNotThrough]);
                done();
            });
        });
        it("not through phone", (done) => {
            ve.allExec([
                ve.rule('timeOut', 'timeOut').test(true),
                ve.rule('phone', 'iphone').test(jp)
            ], result => {
                expect(result).toEqual([phoneNotThrough]);
                done();
            });
        });
        it("not through both", (done) => {
            ve.allExec([
                ve.rule('timeOut', 'timeOut').test(false),
                ve.rule('phone', 'iphone').test(jp)
            ], result => {
                expect(result).toEqual([timeOutNotThrough, phoneNotThrough]);
                done();
            });
        });
    });
});