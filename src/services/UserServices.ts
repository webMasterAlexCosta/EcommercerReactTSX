import * as userRepository from "../repository/UserRepository"

const findMe = async () => {
  try {
    return userRepository.findMe();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {findMe}