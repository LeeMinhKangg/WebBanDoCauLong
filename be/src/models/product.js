const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const sequelize = require('../config/sequelize');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    compareAtPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'draft'),
      defaultValue: 'active',
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    searchKeywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'search_keywords',
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'seo_title',
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'seo_description',
    },
    seoKeywords: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      field: 'seo_keywords',
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    hooks: {
      beforeValidate: (product) => {
        if (product.name) {
          // Tạo slug với một chuỗi ngẫu nhiên để đảm bảo tính duy nhất
          const randomString = Math.random().toString(36).substring(2, 8);
          product.slug =
            slugify(product.name, {
              lower: true,
              strict: true,
            }) +
            '-' +
            randomString;
        }
      },
      beforeCreate: async (product) => {
        // Auto-generate search keywords when creating new product
        if (!product.searchKeywords || product.searchKeywords.length === 0) {
          const keywordGeneratorService = require('../services/keywordGenerator.service');
          product.searchKeywords = keywordGeneratorService.generateKeywords({
            name: product.name,
            shortDescription: product.shortDescription,
            description: product.description,
            category: product.category,
          });
        }
      },
      beforeUpdate: async (product) => {
        // Auto-regenerate search keywords when updating product
        if (
          product.changed('name') ||
          product.changed('shortDescription') ||
          product.changed('description') ||
          product.changed('category')
        ) {
          const keywordGeneratorService = require('../services/keywordGenerator.service');
          product.searchKeywords = keywordGeneratorService.generateKeywords({
            name: product.name,
            shortDescription: product.shortDescription,
            description: product.description,
            category: product.category,
          });
        }
      },
    },
  }
);

module.exports = Product;
