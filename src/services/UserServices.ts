import * as userRepository from "../repository/UserRepository"

const findMe = async () => {
    return userRepository.findMe();
};

export {findMe}