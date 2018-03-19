import {recipe as Recipe, review as Review, Sequelize} from '../models';

const Op = Sequelize.Op;
export default (req, res, next) =>
  //  this returns recipes that the particular user has reviewed with more than 2 stars. specs may change in the future
  Recipe.all({
    raw: true,
    include: [{
      model: Review,
      where: {
        'star': {
          [Op.gt]: 2
        },
        user_id: req.params['userId'] // analogous to including User
      },
      attributes: [],
    }]
  })
  .then(recipes =>
    res.send(recipes)
  )
