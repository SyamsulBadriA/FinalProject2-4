'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("SocialMedia", "UserId", {
      type: Sequelize.INTEGER
    })

    await queryInterface.addConstraint("SocialMedia", {
      fields: ["UserId"],
      type: "foreign key",
      name: "user_fk",
      references: {
        table: "Users",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("SocialMedia", "user_fk");
    await queryInterface.removeColumn("SocialMedia", "UserId")
  }
};
