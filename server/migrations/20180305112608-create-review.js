
export default {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      comment: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      star: {
        type: Sequelize.INTEGER
      },

      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'shuffler'
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      recipe_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'recipes',
            schema: 'shuffler',
          },
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {
      schema: 'shuffler',
    })
      .then(() =>
        queryInterface.addConstraint({
          tableName: 'reviews',
          schema: 'shuffler'
        }, [
          'user_id', 'recipe_id'
        ], {
          type: 'unique',
        }))
      .then(() =>
        queryInterface.addConstraint({
          tableName: 'reviews',
          schema: 'shuffler'
        }, [
          'star'
        ], {
          type: 'check',
          where: {
            star: [
              1, 2, 3, 4, 5
            ]
          }
        })),

  down: queryInterface => (
    queryInterface.dropTable({
      tableName: 'reviews',
      schema: 'shuffler'
    })
  )
};
