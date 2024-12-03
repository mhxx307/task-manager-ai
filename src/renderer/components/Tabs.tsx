import React from 'react';

interface TabsProps {
  categories: string[]; // List of category names
  activeCategory: string; // Currently active category
  onCategoryChange: (category: string) => void; // Callback for tab change
}

const Tabs: React.FC<TabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <ul className="flex space-x-4 border-b pb-2">
      {categories.map((category) => (
        <li
          key={category}
          className={`cursor-pointer ${
            activeCategory === category
              ? 'text-blue-500 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </li>
      ))}
    </ul>
  );
};

export default Tabs;
