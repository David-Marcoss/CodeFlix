import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Config } from "../config";

export function setupSequelize(options: SequelizeOptions) {
  let _sequelize: Sequelize;

  beforeEach(async () => {
    _sequelize = new Sequelize({
      ...Config.db(),
      ...options,
    });

    await _sequelize.authenticate();
  });

  beforeEach(async () => {
    await _sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await _sequelize.close();
  });

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
