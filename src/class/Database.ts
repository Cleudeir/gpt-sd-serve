import { Model, ModelAttributes, ModelStatic, Sequelize } from "sequelize";

type tableNames = "User" | "News";
type models = {
  [key in tableNames]: ModelStatic<Model<any, any>>;
};

class Database {
  public sequelize: Sequelize;
  public models: models;
  constructor() {
    this.sequelize = new Sequelize("database", "username", "password", {
      host: "localhost",
      dialect: "postgres",
    });
    this.models = this.sequelize.models as models;
  }

  public async connect() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  public async close() {
    if (this.sequelize) {
      await this.sequelize.close();
    }
  }

  public async createTable(name: tableNames, options: ModelAttributes) {
    if (!this.sequelize) {
      console.error("Database connection not established.");
      return;
    }

    try {
      // Define the model
      const model = this.sequelize.define(name, options, { timestamps: true });
      await model.sync({ force: false });
      console.log(`Model "${name}" created successfully.`);
      return model;
    } catch (error) {
      console.error("Error creating model:", error);
    }
  }
}

export default new Database();
