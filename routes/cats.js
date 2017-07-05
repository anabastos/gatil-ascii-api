const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/cats',
        handler: function (request, reply) {

            db.cats.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/cats/{id}',
        handler: function (request, reply) {

            db.cats.findOne({
                _id: request.params.id
            }, (err, doc) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (!doc) {
                    return reply(Boom.notFound());
                }

                reply(doc);
            });

        }
    });

    server.route({
        method: 'POST',
        path: '/cats',
        handler: function (request, reply) {

            const cat = request.payload;

            cat._id = uuid.v1();

            db.cats.save(cat, (err, result) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(cat);
            });
        },
        config: {
            validate: {
                payload: {
                    upper: Joi.string().min(2).max(10).required(),
                    head: Joi.string().min(2).max(10).required(),
                    body: Joi.string().min(2).max(10).required(),
                    feet: Joi.string().min(2).max(10).required(),
                }
            }
        }
    });

    server.route({
        method: 'PATCH',
        path: '/cats/{id}',
        handler: function (request, reply) {

            db.cats.update({
                _id: request.params.id
            }, {
                $set: request.payload
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        },
        config: {
            validate: {
                payload: Joi.object({
                    upper: Joi.string().min(2).max(10).required(),
                    head: Joi.string().min(2).max(10).required(),
                    body: Joi.string().min(2).max(10).required(),
                    feet: Joi.string().min(2).max(10).required(),
                }).required().min(1)
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: '/cats/{id}',
        handler: function (request, reply) {

            db.cats.remove({
                _id: request.params.id
            }, function (err, result) {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                if (result.n === 0) {
                    return reply(Boom.notFound());
                }

                reply().code(204);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-cats'
};
