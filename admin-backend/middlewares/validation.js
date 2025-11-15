const z = require("zod");

function validate(schema) {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            console.error("❌ Zod validation failed:", error.errors);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors
            });
        }
    };
}

module.exports = validate;
