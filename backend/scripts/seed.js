// scripts/seed.js
import mongoose from 'mongoose';
import Brand from '../models/Brand.js';
import Model from '../models/Model.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const MONGO_URL = process.env.MONGO_URL;

const seed = async () => {
  await mongoose.connect(MONGO_URL);

  const brands = [
    { brand_id: 'brand_apple', name: 'Apple' },
    { brand_id: 'brand_samsung', name: 'Samsung' },
    { brand_id: 'brand_xiaomi', name: 'Xiaomi' },
    { brand_id: 'brand_huawei', name: 'Huawei' },
    { brand_id: 'brand_motorola', name: 'Motorola' }
  ];

  // Verificar si ya existe Apple antes de insertar
  const exists = await Brand.findOne({ brand_id: 'brand_apple' });
  if (!exists) {
    await Brand.insertMany(brands);
    console.log('Marcas insertadas');
  }

  const models = [
    { model_id: 'model_iphone15', brand_id: 'brand_apple', name: 'iPhone 15' },
    { model_id: 'model_s24', brand_id: 'brand_samsung', name: 'Galaxy S24' },
    { model_id: 'model_edge40', brand_id: 'brand_motorola', name: 'Edge 40' }
  ];

  const modelExists = await Model.findOne({ model_id: 'model_iphone15' });
  if (!modelExists) {
    await Model.insertMany(models);
    console.log('Modelos insertados');
  }

  process.exit();
};

seed();
