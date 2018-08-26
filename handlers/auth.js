const bcrypt = require('bcrypt');

const saltRounds = 10;

exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

exports.checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
}