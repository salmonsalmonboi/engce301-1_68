// middleware/validation.js - Professional validation with Joi
const Joi = require('joi');
const { AGENT_STATUS, DEPARTMENTS } = require('../utils/constants');
const { sendError } = require('../utils/apiResponse');

// ---------- Schemas ----------
const schemas = {
  // ✅ Agent create/update schema
  agent: Joi.object({
    agentCode: Joi.string()
      .pattern(/^[A-Z]\d{3}$/)
      .required()
      .messages({
        'string.pattern.base': 'Agent code must be in format A001 (letter + 3 digits)',
        'any.required': 'Agent code is required'
      }),
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
    department: Joi.string()
      .valid(...DEPARTMENTS)
      .default('General')
      .messages({
        'any.only': `Department must be one of: ${DEPARTMENTS.join(', ')}`
      }),
    skills: Joi.array().items(Joi.string().min(2).max(50)).default([]).messages({
      'array.base': 'Skills must be an array of strings'
    })
  }),

  // ✅ Status update schema (ทำ TODO #4 แล้ว)
  statusUpdate: Joi.object({
    status: Joi.string()
      .valid(...Object.values(AGENT_STATUS))
      .required()
      .messages({
        'any.only': `Status must be one of: ${Object.values(AGENT_STATUS).join(', ')}`,
        'any.required': 'Status is required'
      }),
    reason: Joi.string().max(200).optional().messages({
      'string.max': 'Reason cannot exceed 200 characters'
    })
  })
};

// ---------- Helpers ----------
const mapJoiErrors = (error) =>
  error.details.map(d => ({
    field: d.path.join('.'),
    message: d.message
  }));

// ---------- Middlewares ----------
const validateAgent = (req, res, next) => {
  const { error, value } = schemas.agent.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = mapJoiErrors(error);
    console.log('❌ Validation failed:', validationErrors);
    return sendError(res, 'Validation failed', 400, validationErrors);
  }

  req.body = value;
  next();
};

// ✅ ทำ TODO #5: validateStatusUpdate
const validateStatusUpdate = (req, res, next) => {
  const { error, value } = schemas.statusUpdate.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const validationErrors = mapJoiErrors(error);
    console.log('❌ Status update validation failed:', validationErrors);
    return sendError(res, 'Validation failed', 400, validationErrors);
  }

  req.body = value;
  next();
};

module.exports = {
  validateAgent,
  validateStatusUpdate
};
