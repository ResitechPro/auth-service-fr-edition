import BaseRepository from "./BaseRepository.js";

class UserTokenRepository extends BaseRepository {
  findByToken = async (token, includeDeleted = false) => {
    const document = await this.model.findOne({ refreshToken: token });
    return document;
  };

  upsert = async (token, userId, includeDeleted = false) => {
    const query = includeDeleted ? { userId } : { userId, isDeleted: false };

    const document = await this.model.findOneAndUpdate(
      query,
      { refreshToken: token },
      { upsert: true, new: true }
    );
    return document;
  };

  softDeleteByToken = async (token, includeDeleted = false) => {
    const query = includeDeleted
      ? { refreshToken: token }
      : { refreshToken: token, isDeleted: false };

    const document = await this.model.findOneAndUpdate(
      query,
      { isDeleted: true },
      { new: true }
    );
    return document;
  };

  softDeleteByUserId = async (userId, includeDeleted = false) => {
    const query = includeDeleted ? { userId } : { userId, isDeleted: false };

    const document = await this.model.findOneAndUpdate(
      query,
      { isDeleted: true },
      { new: true }
    );
    return document;
  };
}

export default UserTokenRepository;
