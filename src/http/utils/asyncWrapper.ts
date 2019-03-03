export default function asyncWrapper(fn: Function) {
    return async(req, res, next) => {
        try {
            await fn(req, res);
            return;
        } catch (err) {
            next(err);
        }
    };
}