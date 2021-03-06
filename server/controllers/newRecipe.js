import { recipe as Recipe, user as User, ingredient as Ingredient, sequelize } from '../models';

import createOrUpdate from './common';

export default (req, res) => {
  if (req.session.user) {
    // query by cookie value
    const userId = req.session.user;

    return sequelize.transaction(t => User.findById(userId)
      .then((user) => {
        if (!user) {
          res.status(400).send({
            status: 'Fail, no such user in database'
          });
          // pass control to catch
          throw new Error('No such user in database');
        }
        return user;
      })
      .then(user => Promise.all([
        Recipe.create({
          name: req.body.name,
          direction: req.body.direction,
          per_serving: parseInt(req.body.per_serving, 10)
        }, {
          fields: [
            'name', 'direction', 'per_serving'
          ],
          benchmark: true,
          transaction: t
        }),
        user,
      ]))
      .then(([recipe, user]) =>
        // associate
        user.addRecipe(recipe, {
          transaction: t,
        })
          .then(() =>
            createOrUpdate(recipe, req.body.ingredients, t))
          .then(() => recipe)))
      .then(recipe => recipe.reload({
        include: [{
          model: Ingredient,
        }]
      }))
      .then(recipe => res.status(201).send({
        status: 'added',
        recipe
      }))

      .catch(e =>
        (res.writable
          ? res.status(500).send({
            [e.name]: e.message
          })
          : console.error(e)));
  }
  // better a redirect when applicable, or serve login page
  res.status(403).send({
    status: 'fail, signin or signup'
  });
};
