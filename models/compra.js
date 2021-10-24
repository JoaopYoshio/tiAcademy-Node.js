'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Compra.belongsTo(models.Cliente, {
        foreignKey: 'ClienteId', as: 'clientesCompr'});
      Compra.belongsToMany(models.Produto,{
        foreignKey: 'ProdutoId', through: 'ItemCompra', as: 'produtos_ped'});
      Compra.hasMany(models.ItemCompra, {
        foreignKey: 'CompraId', as: 'item_compras'});
    }
  };
  Compra.init({
    data: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Compra',
  });
  return Compra;
};