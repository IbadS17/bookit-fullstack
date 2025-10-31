// POST /promo/validate
exports.validatePromo = async (req, res) => {
  const { code } = req.body;
  const promos = {
    SAVE10: 0.1,
    FLAT100: 100,
  };

  if (!promos[code])
    return res.json({ valid: false, message: "Invalid promo code" });

  res.json({ valid: true, discount: promos[code] });
};
