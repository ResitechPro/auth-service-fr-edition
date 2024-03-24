import BaseRepository from "./BaseRepository.js";

class UserRepository extends BaseRepository {
  async findByEmail(email, includeDeleted = false) {
    const query = includeDeleted ? { email } : { email, isDeleted: false };
    return this.model.findOne(query);
  }

  async findByUserName(userName, includeDeleted = false) {
    const query = includeDeleted
      ? { userName }
      : { userName, isDeleted: false };

    return this.model.findOne(query);
  }

  async findByEmailOrUserName(emailOrUserName, includeDeleted = false) {
    const query = includeDeleted
      ? {
          $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
        }
      : {
          $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
          isDeleted: false,
        };

    return this.model.findOne(query);
  }
}

export default UserRepository;
