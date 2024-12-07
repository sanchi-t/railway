const Joi = require('joi');

const validateUserRegistration = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid('admin', 'user').default('user'),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = { validateUserRegistration };

