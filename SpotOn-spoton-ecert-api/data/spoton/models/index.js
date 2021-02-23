import fs         from 'fs';
import path       from 'path';
import Sequelize  from 'sequelize';
import config     from '../../../config/config';

class MainModels
{
   loadModels()
   {
      var models = {}

      const Conn = new Sequelize(config.database.dbname, config.database.dbusername, config.database.dbpassword, {
        host: config.database.dbhost,
        port: config.database.dbport,
        dialect: 'postgres'
      });

      console.log("loading models...");
      fs
        .readdirSync(__dirname)
        .filter(function(file) {
          return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function(file) {
          var model = Conn.import(path.join(__dirname, file));
          models[model.name] = model;
        });

      Object.keys(models).forEach(function(modelName) {
        if ("associate" in models[modelName]) {
          models[modelName].associate(models);
        }
      });

      this.Sequelize = Sequelize;
      this.Conn = Conn;
      this.models =  models;      
   }

   close()
   {
      console.log("Closing Connection...");
      this.Conn.close();
   }

   constructor()
   {
      this.loadModels();
   }
}

export default MainModels;