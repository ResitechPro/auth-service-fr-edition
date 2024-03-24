class User {
  constructor({
    userName,
    image = null,
    email,
    password,
    isVerified = false,
    createdAt = new Date(),
    updatedAt = new Date(),
    isDeleted = false,
  }) {
    this.userName = userName;
    this.image = image;
    this.email = email;
    this.password = password;
    this.isVerified = isVerified;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isDeleted = isDeleted;
  }
}
