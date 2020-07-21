const { assert } = require('chai');
const { initializeDataBase, Users } = require('../dataBaseOperations');

describe('Users', function () {
  let users;

  before(async () => {
    const db = await initializeDataBase('./test.db');
    users = new Users(db);
    return;
  });

  it('should get the user info', function (done) {
    users.getUserInfo('bernie-walker').then((userInfo) => {
      assert.deepStrictEqual(userInfo, {
        id: 'bernie-walker',
        display_name: 'Bernard',
        avatar_url: 'https://avatars2.githubusercontent.com/u/58025656?v=4',
        bio: null,
      });
      done();
    });
  });
});
