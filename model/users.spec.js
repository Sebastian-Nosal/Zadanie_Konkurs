const { ObjectId } = require('mongodb');
const Model = require('./users');

const simple = {
    _id: new ObjectId("63481c198556717969a7310e"),
    name: 'teacher@test.local',
    password: 'd62f11d58daaae1640297c8a18b6e19f575c733f6beaf00c86e190067c1c6890',
    type: 'teacher'
  }
  console.log(simple._id)
  const result = async () => console.log(await Model.getUserById("teacher@test.local"));
  result();
  const correctID = '63481c198556717969a7310e'

describe(`Users's Model Layer Testing`,  () => {
   test('CheckCrediatials when correct',async ()=>{
        expect(await Model.checkCredentials(simple.name,simple.password)).toBe(true);
    })
    test('CheckCrediatials when incorrect',async ()=>{
        expect(await Model.checkCredentials(simple.name,"abc")).toBe(false);
    })
    test('CheckCrediatials when first of them is undefined',async ()=>{
        expect(await Model.checkCredentials(undefined, simple.password)).toBe(false);
    })
    test('CheckCrediatials when both of them is undefined',async ()=>{
        expect(await Model.checkCredentials(undefined, undefined)).toBe(false);
    })
    test('CheckCrediatials when second of them is undefined',async ()=>{
        expect(await Model.checkCredentials(simple.name, undefined)).toBe(false);
    })

    test('Get User by Id when Id is corect', async ()=>{
        expect(await Model.getUserById(correctID)).toStrictEqual(simple)
    })
    test('Get User by Id when Id is incorect', async ()=>{
        expect(await Model.getUserById("32rf35retbdsegwjkt6yo34utg90346")).toBe(null)
    })
    test('Get User by Id when Id is undefined', async ()=>{
        expect(await Model.getUserById(undefined)).toBe(null)
    })

    test('Get User by name when name is corect', async ()=>{
        expect(await Model.getUserByUsername("teacher@test.local")).toStrictEqual(simple)
    })
    test('Get User by name when name is incorect', async ()=>{
        expect(await Model.getUserByUsername("Q@WER@")).toBe(null)
    })
    test('Get User by name when name is undefined', async ()=>{
        expect(await Model.getUserByUsername(undefined)).toBe(null)
    })

    test('Insert User - correct args', async ()=>{
        expect(await Model.insertUser("simpleUserN@me", "simplePass", "Any")).toBe(true)
    })
    test('Insert User - missing args', async ()=>{
        expect(await Model.insertUser("simpleUserN@me1", "Any")).toBe(false)
    })
    test('Insert User - user is already in db', async ()=>{
        expect(await Model.insertUser("simpleUserN@me", "simplePass", "Any")).toBe(false)
    })
    
    test('Delete user by ID when Id is correct', async()=>{
        const id = await Model.getUserByUsername('simpleUserN@me')._id;
        expect(await Model.deleteUserById(id)).toBe(true)
    })

    test('Delete user by ID when Id is incorrect', async()=>{
        expect(await Model.deleteUserById("incorrectID")).toBe(false)
    })

    test('Delete user by ID when Id is undefined', async()=>{
        expect(await Model.deleteUserById()).toBe(false)
    })
   
});
