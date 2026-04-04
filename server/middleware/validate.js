export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') });
    }
    return res.status(400).json({ error: 'Validation Error' });
  }
};
