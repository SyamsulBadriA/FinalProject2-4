'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
    {
      full_name: "John Doe",
      email: "testing@beta.com",
      username: "john-doe",
      password: "qwerty123",
      profile_image_url: "https://imageurl.com",
      age: 23,
      phone_number: 628123456789
    },
    {
      full_name: "John Doe 2",
      email: "testing2@beta.com",
      username: "john-doe2",
      password: "qwerty123",
      profile_image_url: "https://imageurl.com",
      age: 23,
      phone_number: 628123456789
    }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
