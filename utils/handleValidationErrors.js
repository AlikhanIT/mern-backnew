import {validationResult} from "express-validator";

export default (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.status(403).json(errors.array());
        }
        else {
            next();
        }
    } catch (err) {
        res.json({
            message: 'ERROR',
        })
    }
};