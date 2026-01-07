/**
 * Seed Script for Firebase Data
 * 
 * This script populates Firebase with sample menu categories and items.
 * 
 * Usage:
 * 1. Make sure Firebase is configured in your .env file
 * 2. Run: npm run seed (add script to package.json)
 *    OR import and run manually in browser console
 */

import { firestoreService } from '../services/firebase/firestoreService';
import type { CategoryData } from '../types/category';
import type { MenuItemData } from '../types/menuItem';

/**
 * Sample categories data
 */
const sampleCategories: Array<CategoryData & { items: MenuItemData[] }> = [
  {
    order: 1,
    mainImage: '', // Will be set after upload or use placeholder
    title: {
      en: 'Sweet Crepes',
      ar: 'كريب حلو',
    },
    description: {
      en: 'Indulge in our delicious sweet crepes made with premium ingredients and fresh toppings.',
      ar: 'استمتع بكريبنا الحلو اللذيذ المصنوع من مكونات ممتازة وإضافات طازجة.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Chocolate & Banana',
          ar: 'شوكولاتة وموز',
        },
        image: '',
        price: 3.5,
      },
      {
        order: 2,
        name: {
          en: 'Strawberry Delight',
          ar: 'فراولة لذيذة',
        },
        image: '',
        price: 3.5,
      },
      {
        order: 3,
        name: {
          en: 'Nutella & Berries',
          ar: 'نوتيلا وتوت',
        },
        image: '',
        price: 4.0,
      },
    ],
  },
  {
    order: 2,
    mainImage: '',
    title: {
      en: 'Savory Crepes',
      ar: 'كريب مالح',
    },
    description: {
      en: 'Satisfying savory crepes filled with fresh vegetables, cheeses, and premium meats.',
      ar: 'كريب مالح مشبع محشو بالخضروات الطازجة والأجبان واللحوم الممتازة.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Chicken & Mushroom',
          ar: 'دجاج وفطر',
        },
        image: '',
        price: 5.0,
      },
      {
        order: 2,
        name: {
          en: 'Spinach & Feta',
          ar: 'سبانخ وجبنة فيتا',
        },
        image: '',
        price: 4.5,
      },
    ],
  },
  {
    order: 3,
    mainImage: '',
    title: {
      en: 'Fruit Crepes',
      ar: 'كريب الفواكه',
    },
    description: {
      en: 'Fresh and healthy crepes topped with seasonal fruits and natural sweeteners.',
      ar: 'كريب طازج وصحي مغطى بالفواكه الموسمية والتحلية الطبيعية.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Mixed Berries',
          ar: 'توت مختلط',
        },
        image: '',
        price: 4.0,
      },
      {
        order: 2,
        name: {
          en: 'Apple Cinnamon',
          ar: 'تفاح وقرفة',
        },
        image: '',
        price: 3.5,
      },
      {
        order: 3,
        name: {
          en: 'Tropical Fruits',
          ar: 'فواكه استوائية',
        },
        image: '',
        price: 4.5,
      },
    ],
  },
  {
    order: 4,
    mainImage: '',
    title: {
      en: 'Special Crepes',
      ar: 'كريب خاص',
    },
    description: {
      en: 'Our signature crepes with unique combinations and premium ingredients.',
      ar: 'كريبنا المميز بتركيبات فريدة ومكونات ممتازة.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Crepe Suzette',
          ar: 'كريب سوزيت',
        },
        image: '',
        price: 5.5,
      },
      {
        order: 2,
        name: {
          en: 'Red Velvet Crepe',
          ar: 'كريب ريد فيلفت',
        },
        image: '',
        price: 5.0,
      },
    ],
  },
  {
    order: 5,
    mainImage: '',
    title: {
      en: 'Breakfast Crepes',
      ar: 'كريب الإفطار',
    },
    description: {
      en: 'Perfect way to start your day with our breakfast crepe selection.',
      ar: 'طريقة مثالية لبدء يومك مع تشكيلة كريب الإفطار لدينا.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Egg & Cheese',
          ar: 'بيض وجبن',
        },
        image: '',
        price: 4.0,
      },
      {
        order: 2,
        name: {
          en: 'Bacon & Maple',
          ar: 'لحم مقدد وشراب القيقب',
        },
        image: '',
        price: 4.5,
      },
    ],
  },
  {
    order: 6,
    mainImage: '',
    title: {
      en: 'Ice Cream Crepes',
      ar: 'كريب الآيس كريم',
    },
    description: {
      en: 'Cool down with our ice cream crepes, a perfect treat for any time of day.',
      ar: 'استمتع بكريب الآيس كريم المنعش، حلوى مثالية في أي وقت من اليوم.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Vanilla Ice Cream',
          ar: 'آيس كريم فانيليا',
        },
        image: '',
        price: 4.0,
      },
      {
        order: 2,
        name: {
          en: 'Chocolate Chip',
          ar: 'رقائق الشوكولاتة',
        },
        image: '',
        price: 4.5,
      },
    ],
  },
  {
    order: 7,
    mainImage: '',
    title: {
      en: 'Kids Crepes',
      ar: 'كريب للأطفال',
    },
    description: {
      en: 'Fun and delicious crepes specially designed for kids with their favorite flavors.',
      ar: 'كريب ممتع ولذيذ مصمم خصيصاً للأطفال بنكهاتهم المفضلة.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Chocolate & Marshmallow',
          ar: 'شوكولاتة ومارشميلو',
        },
        image: '',
        price: 3.0,
      },
      {
        order: 2,
        name: {
          en: 'PB & J',
          ar: 'زبدة فول سوداني ومربى',
        },
        image: '',
        price: 3.0,
      },
    ],
  },
  {
    order: 8,
    mainImage: '',
    title: {
      en: 'Vegan Crepes',
      ar: 'كريب نباتي',
    },
    description: {
      en: 'Plant-based crepes made with wholesome ingredients, perfect for vegan lifestyles.',
      ar: 'كريب نباتي مصنوع من مكونات صحية، مثالي لأسلوب الحياة النباتي.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Avocado & Tomato',
          ar: 'أفوكادو وطماطم',
        },
        image: '',
        price: 4.5,
      },
      {
        order: 2,
        name: {
          en: 'Vegan Chocolate',
          ar: 'شوكولاتة نباتية',
        },
        image: '',
        price: 4.0,
      },
    ],
  },
  {
    order: 9,
    mainImage: '',
    title: {
      en: 'Premium Crepes',
      ar: 'كريب ممتاز',
    },
    description: {
      en: 'Our most luxurious crepes featuring premium ingredients and exquisite presentations.',
      ar: 'كريبنا الفاخر الذي يتميز بمكونات ممتازة وعروض رائعة.',
    },
    items: [
      {
        order: 1,
        name: {
          en: 'Lobster & Caviar',
          ar: 'جراد البحر وكافيار',
        },
        image: '',
        price: 12.0,
      },
      {
        order: 2,
        name: {
          en: 'Truffle & Mushroom',
          ar: 'كمأة وفطر',
        },
        image: '',
        price: 10.0,
      },
    ],
  },
];

/**
 * Seed function to populate Firebase
 */
export const seedData = async (): Promise<void> => {
  console.log('🌱 Starting to seed data...');

  try {
    let categoryCount = 0;
    let itemCount = 0;

    for (const categoryData of sampleCategories) {
      // Extract items before creating category
      const { items, ...categoryWithoutItems } = categoryData;

      // Create category
      console.log(`Creating category: ${categoryData.title.en}...`);
      const categoryId = await firestoreService.createCategory(categoryWithoutItems);
      categoryCount++;

      // Create items for this category
      for (const itemData of items) {
        console.log(`  Creating item: ${itemData.name.en}...`);
        await firestoreService.createItem(categoryId, itemData);
        itemCount++;
      }
    }

    console.log(`✅ Successfully seeded ${categoryCount} categories and ${itemCount} items!`);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

/**
 * Clear all data (use with caution!)
 */
export const clearAllData = async (): Promise<void> => {
  console.log('🗑️ Clearing all data...');

  try {
    const categories = await firestoreService.getCategories();

    for (const category of categories) {
      // Delete all items first
      if (category.items) {
        for (const item of category.items) {
          await firestoreService.deleteItem(category.id, item.id);
        }
      }

      // Delete category
      await firestoreService.deleteCategory(category.id);
    }

    console.log('✅ All data cleared!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
};

// Export for use in browser console or scripts
if (typeof window !== 'undefined') {
  (window as any).seedData = seedData;
  (window as any).clearAllData = clearAllData;
  console.log('💡 Seed functions available: window.seedData() and window.clearAllData()');
}

