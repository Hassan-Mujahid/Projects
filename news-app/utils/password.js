"use server";

import bcryptjs from "bcryptjs";

export const saltAndHashPassword = async (password) => {
  const pwHash = bcryptjs.hashSync(password, 10);
  return pwHash;
};

export const verifyPassword = async (password, hashedPassword) => {
  return bcryptjs.compareSync(password, hashedPassword);
};
