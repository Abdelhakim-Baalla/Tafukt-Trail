const { validateRegister, validateLogin } = require('../../../validators/authValidator');

describe('AuthValidator - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe('validateRegister', () => {
    it('should pass with valid data', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: 'password123',
        telephone: '+212612345678'
      };

      validateRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail with invalid email', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'invalid',
        motDePasse: 'password123',
        telephone: '+212612345678'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should fail with short password', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: '123',
        telephone: '+212612345678'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateLogin', () => {
    it('should pass with valid data', () => {
      req.body = {
        email: 'jean@test.com',
        motDePasse: 'password123'
      };

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should fail with invalid email', () => {
      req.body = {
        email: 'invalid',
        motDePasse: 'password123'
      };

      validateLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
