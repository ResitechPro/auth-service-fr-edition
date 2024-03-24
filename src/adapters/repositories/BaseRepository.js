import ClientError from "../../infrastructure/exceptions/ClientError.js";
import NotFoundError from "../../infrastructure/exceptions/NotFoundError.js";

/**
 * @template T
 * @abstract
 * @class
 * @classdesc Base repository class for CRUD operations.
 */
class BaseRepository {
  /**
   * @param {import('mongoose').Model<T>} model - The Mongoose model.
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Creates a new document.
   * @param {T} data - The data for the new document.
   * @returns {Promise<T>} The created document.
   * @throws {ClientError} If an error occurs during the creation.
   */
  create = async (data) => {
    try {
      return await this.model.create(data);
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new ClientError(`Validation failed ${error}`);
      } else if (error.code === 11000 || error.name === "MongoError") {
        throw new ClientError(`Duplicate key error ${error}`);
      } else {
        throw error;
      }
    }
  };

  /**
   * Creates multiple documents.
   * @param {T[]} data - The data for the new documents.
   * @returns {Promise<T[]>} The created documents.
   * @throws {ClientError} If an error occurs during the creation.
   */
  createMany = async (data) => {
    try {
      return await this.model.insertMany(data);
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new ClientError(`Validation failed ${error}`);
      } else if (error.code === 11000 || error.name === "MongoError") {
        throw new ClientError(`Duplicate key error ${error}`);
      } else {
        throw error;
      }
    }
  };

  /**
   * Finds documents based on conditions.
   * @param {object} [conditions={}] - The conditions to filter the documents.
   * @param {boolean} [includeDeleted=false] - Whether to include soft-deleted documents.
   * @returns {Promise<T[]>} The found documents.
   * @throws {Error} If an error occurs during the search.
   */
  find = async (conditions = {}, includeDeleted = false) => {
    const query = includeDeleted
      ? conditions
      : { ...conditions, isDeleted: false };

    return await this.model.find(query);
  };

  /**
   * Find one document based on conditions.
   * @param {object} [conditions={}] - The conditions to filter the documents.
   * @param {boolean} [includeDeleted=false] - Whether to include soft-deleted documents.
   * @returns {Promise<T|null>} The found document, or null if not found.
   * @throws {Error} If an error occurs during the search.
   */
  findOne = async (conditions = {}, includeDeleted = false) => {
    const query = includeDeleted
      ? conditions
      : { ...conditions, isDeleted: false };

    return await this.model.findOne(query);
  };

  /**
   * Finds a document by its ID.
   * @param {string} id - The ID of the document.
   * @param {boolean} [includeDeleted=false] - Whether to include soft-deleted documents.
   * @returns {Promise<T|null>} The found document, or null if not found.
   * @throws {NotFoundError} If the document is not found.
   * @throws {Error} If an error occurs during the search.
   */
  findById = async (id, includeDeleted = false) => {
    const query = includeDeleted ? { _id: id } : { _id: id, isDeleted: false };

    return await this.model.findOne(query);
  };

  /**
   * Updates a document by its ID.
   * @param {string} id - The ID of the document.
   * @param {Partial<T>} data - The data to update the document with.
   * @returns {Promise<T|null>} The updated document, or null if not found.
   * @throws {NotFoundError} If the document is not found.
   */
  update = async (id, data) => {
    const updatedDoc = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedDoc) {
      throw new NotFoundError("Document not found or soft-deleted");
    }

    return updatedDoc;
  };

  /**
   * Soft deletes a document by its ID.
   * @param {string} id - The ID of the document.
   * @returns {Promise<T|null>} The soft-deleted document, or null if not found.
   * @throws {NotFoundError} If the document is not found.
   */
  softDelete = async (id) => {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundError("Document not found or soft-deleted");
    }
    return await this.model.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  };

  /**
   * Force deletes a document by its ID.
   * @param {string} id - The ID of the document.
   * @returns {Promise<T|null>} The deleted document, or null if not found.
   * @throws {NotFoundError} If the document is not found.
   */
  forceDelete = async (id) => {
    const document = await this.model.findByIdAndDelete(id);
    if (!document) {
      throw new NotFoundError("Document not found");
    }
    return document;
  };
}

export default BaseRepository;
