import NotFoundError from "../infrastructure/exceptions/NotFoundError.js";

class Container {
  static instance;

  constructor() {
    this.dependencies = {};
  }

  static getInstance() {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  register(name, dependency) {
    this.dependencies[name] = dependency;
  }

  resolve(name) {
    if (this.dependencies[name]) {
      return this.dependencies[name];
    }
    throw new NotFoundError(`Dependency '${name}' not found`);
  }
}

export default Container;
