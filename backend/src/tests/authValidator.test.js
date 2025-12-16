const { validateRegister, validateLogin } = require('../validators/authValidator');
const RoleUtilisateur = require('../enums/roles');

describe('Auth Validators', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('validateRegister', () => {
    it('should pass validation with valid data', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: 'password123',
        telephone: '+212612345678',
        role: RoleUtilisateur.CHAUFFEUR
      };

      validateRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail if email is invalid', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'invalid-email',
        motDePasse: 'password123',
        telephone: '+212612345678'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if password is too short', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: '123',
        telephone: '+212612345678'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if nom is too short', () => {
      req.body = {
        nom: 'D',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: 'password123',
        telephone: '+212612345678'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if telephone is invalid', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: 'password123',
        telephone: '123'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if required fields are missing', () => {
      req.body = {
        nom: 'Dupont',
        email: 'jean@test.com'
        // Missing prenom, motDePasse, telephone
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if role is invalid', () => {
      req.body = {
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.com',
        motDePasse: 'password123',
        telephone: '+212612345678',
        role: 'INVALID_ROLE'
      };

      validateRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateLogin', () => {
    it('should pass validation with valid credentials', () => {
      req.body = {
        email: 'jean@test.com',
        motDePasse: 'password123'
      };

      validateLogin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should fail if email is invalid', () => {
      req.body = {
        email: 'invalid-email',
        motDePasse: 'password123'
      };

      validateLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if password is missing', () => {
      req.body = {
        email: 'jean@test.com'
      };

      validateLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if email is missing', () => {
      req.body = {
        motDePasse: 'password123'
      };

      validateLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should fail if both fields are missing', () => {
      req.body = {};

      validateLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
