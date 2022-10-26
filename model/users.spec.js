const Model = require('./users');

describe(`Users's Model Layer Testing`, () => {
    test('Test getUserById when id exist',()=>{
        expect(Model.getUserById('63481c198556717969a7310e')).toBe({})
    })
});
