const { validationResult, body } = require('express-validator');

const validateUser = [

    body('firstname')
        .notEmpty()
        .withMessage('First Name is required'),

    body('lastname')
        .notEmpty()
        .withMessage('Last Name is required'),

    body('email')
        .isEmail()
        .withMessage('Invalid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    (request, response, next) => {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {

            let errorMessage = errors
                .array()
                .map(it => it.msg)
                .join(",");

            return response.status(422).json({
                success: false,
                message: errorMessage
            });
        }

        next();
    }
];

module.exports = {
    validateUser
}