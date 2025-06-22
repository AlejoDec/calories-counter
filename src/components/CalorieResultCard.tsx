
import React from 'react';
import { FoodCalorieInfo } from '../../types';

interface CalorieResultCardProps {
  item: FoodCalorieInfo;
}

const CalorieResultCard: React.FC<CalorieResultCardProps> = ({ item }) => {
  const totalItemCalories = item.caloriesPerItem * item.quantity;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-green-700 mb-2">
        {item.foodItem} {item.quantity > 1 ? <span className="text-lg text-green-600">(x{item.quantity})</span> : ''}
      </h3>
      <p className="text-gray-700">
        <span className="font-medium">Calories:</span> {item.caloriesPerItem} kcal / item
      </p>
      {item.quantity > 1 && (
        <p className="text-gray-700 font-semibold">
          <span className="font-medium">Subtotal for item:</span> {totalItemCalories} kcal
        </p>
      )}
      <p className="text-gray-600">
        <span className="font-medium">Serving Size (per item):</span> {item.servingSize}
      </p>
    </div>
  );
};

export default CalorieResultCard;
