const { authenticate, authorize } = require('../../../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('AuthMiddleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    req = { header: jest.fn(), user: null };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate with valid token', () => {
      const mockDecoded = { id: '1', role: 'ADMIN' };

      req.header.mockReturnValue('Bearer token123');
      jwt.verify.mockReturnValue(mockDecoded);

      authenticate(req, res, next);

      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
    });

    it('should reject without token', () => {
      req.header.mockReturnValue(null);

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should reject with invalid token', () => {
      req.header.mockReturnValue('Bearer invalid');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid');
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe('authorize', () => {
    it('should allow authorized role', () => {
      req.user = { id: '1', role: 'ADMIN' };
      const middleware = authorize(['ADMIN']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny unauthorized role', () => {
      req.user = { id: '1', role: 'CHAUFFEUR' };
      const middleware = authorize(['ADMIN']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should deny if not authenticated', () => {
      req.user = null;
      const middleware = authorize(['ADMIN']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
