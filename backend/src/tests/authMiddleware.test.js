const { authenticate, authorize } = require('../middlewares/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    
    req = {
      header: jest.fn(),
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    next = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate user with valid token', () => {
      const mockToken = 'valid-token';
      const mockDecoded = { id: '123', role: 'ADMIN' };

      req.header.mockReturnValue(`Bearer ${mockToken}`);
      jwt.verify.mockReturnValue(mockDecoded);

      authenticate(req, res, next);

      expect(req.header).toHaveBeenCalledWith('Authorization');
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(req.user).toEqual(mockDecoded);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject request without token', () => {
      req.header.mockReturnValue(null);

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès refusé. Token manquant.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      const mockToken = 'invalid-token';
      const error = new Error('Invalid token');

      req.header.mockReturnValue(`Bearer ${mockToken}`);
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token invalide ou expiré.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with expired token', () => {
      const mockToken = 'expired-token';
      const error = new Error('Token expired');

      req.header.mockReturnValue(`Bearer ${mockToken}`);
      jwt.verify.mockImplementation(() => {
        throw error;
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle Bearer prefix correctly', () => {
      const mockToken = 'valid-token';
      const mockDecoded = { id: '123', role: 'CHAUFFEUR' };

      req.header.mockReturnValue(`Bearer ${mockToken}`);
      jwt.verify.mockReturnValue(mockDecoded);

      authenticate(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should allow access for authorized role', () => {
      req.user = { id: '123', role: 'ADMIN' };
      const middleware = authorize(['ADMIN']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access when no roles specified', () => {
      req.user = { id: '123', role: 'CHAUFFEUR' };
      const middleware = authorize([]);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      req.user = { id: '123', role: 'CHAUFFEUR' };
      const middleware = authorize(['ADMIN']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Accès interdit. Vous n\'avez pas les droits nécessaires.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access if user not authenticated', () => {
      req.user = null;
      const middleware = authorize(['ADMIN']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Utilisateur non authentifié.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access for multiple authorized roles', () => {
      req.user = { id: '123', role: 'CHAUFFEUR' };
      const middleware = authorize(['ADMIN', 'CHAUFFEUR']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access if role not in authorized list', () => {
      req.user = { id: '123', role: 'GUEST' };
      const middleware = authorize(['ADMIN', 'CHAUFFEUR']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
