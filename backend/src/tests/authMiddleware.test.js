const { authenticate, authorize } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('authenticate', () => {
        it('should return 401 if no token is provided', () => {
            req.header.mockReturnValue(null);

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé. Token manquant.' });
        });

        it('should return 401 if token is invalid', () => {
            req.header.mockReturnValue('Bearer invalidtoken');
            jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide ou expiré.' });
        });

        it('should call next() and populate req.user if token is valid', () => {
            const user = { id: '123', role: 'ADMIN' };
            req.header.mockReturnValue('Bearer validtoken');
            jwt.verify.mockReturnValue(user);

            authenticate(req, res, next);

            expect(req.user).toEqual(user);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorize', () => {
        it('should return 401 if req.user is missing', () => {
            req.user = undefined;
            const middleware = authorize(['ADMIN']);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur non authentifié.' });
        });

        it('should return 403 if user role is not allowed', () => {
            req.user = { role: 'CHAUFFEUR' };
            const middleware = authorize(['ADMIN']);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ message: 'Accès interdit. Vous n\'avez pas les droits nécessaires.' });
        });

        it('should call next() if user role is allowed', () => {
            req.user = { role: 'ADMIN' };
            const middleware = authorize(['ADMIN']);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });
});
