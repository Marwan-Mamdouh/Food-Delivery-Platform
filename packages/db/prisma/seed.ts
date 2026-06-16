import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...')

  // 1. Giza Grill
  const gizaGrill = await prisma.restaurant.upsert({
    where: { id: 'rest-giza-grill' },
    update: {},
    create: {
      id: 'rest-giza-grill',
      name: 'Giza Grill',
    },
  })

  // 2. Mediterranean Bites
  const medBites = await prisma.restaurant.upsert({
    where: { id: 'rest-med-bites' },
    update: {},
    create: {
      id: 'rest-med-bites',
      name: 'Mediterranean Bites',
    },
  })

  // 3. Cairo Coffee House
  const cairoCoffee = await prisma.restaurant.upsert({
    where: { id: 'rest-cairo-coffee' },
    update: {},
    create: {
      id: 'rest-cairo-coffee',
      name: 'Cairo Coffee House',
    },
  })

  const menuItems = [
    // Giza Grill Items
    {
      id: 'item-1',
      name: 'Mixed Grill Platter',
      description: 'A succulent selection of lamb chops, kofta, and chicken shish taouk.',
      price: 250.00,
      category: 'Mains',
      restaurantId: gizaGrill.id,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6e9460272?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'item-2',
      name: 'Hummus with Spiced Lamb',
      description: 'Creamy hummus topped with warm, spiced minced lamb and pine nuts.',
      price: 85.00,
      category: 'Appetizers',
      restaurantId: gizaGrill.id,
      image: 'https://images.unsplash.com/photo-1577906046424-91220a233604?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'item-3',
      name: 'Mint Lemonade',
      description: 'Freshly squeezed lemons with a hint of garden mint.',
      price: 35.00,
      category: 'Drinks',
      restaurantId: gizaGrill.id,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
    },
    // Mediterranean Bites Items
    {
      id: 'item-4',
      name: 'Greek Salad',
      description: 'Crisp cucumbers, tomatoes, red onions, olives, and premium feta cheese.',
      price: 75.00,
      category: 'Appetizers',
      restaurantId: medBites.id,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'item-5',
      name: 'Grilled Salmon Bowl',
      description: 'Atlantic salmon served with quinoa, roasted vegetables, and tahini dressing.',
      price: 180.00,
      category: 'Mains',
      restaurantId: medBites.id,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'item-6',
      name: 'Falafel Wrap',
      description: 'Handmade falafels with pickled turnips, greens, and garlic sauce.',
      price: 65.00,
      category: 'Mains',
      restaurantId: medBites.id,
      image: 'https://images.unsplash.com/photo-1547050605-2f37a1f50a80?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'item-7',
      name: 'Sparkling Berry Tea',
      description: 'Iced hibiscus tea infused with wild berries.',
      price: 45.00,
      category: 'Drinks',
      restaurantId: medBites.id,
      image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800',
    },
    // Cairo Coffee House Items
    {
      id: 'item-8',
      name: 'Caramel Macchiato',
      description: 'Rich espresso with steamed milk and a sweet caramel drizzle.',
      price: 55.00,
      category: 'Drinks',
      restaurantId: cairoCoffee.id,
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'item-9',
      name: 'Egyptian Breakfast Plate',
      description: 'Traditional foul medames, falafel, boiled egg, and fresh baladi bread.',
      price: 90.00,
      category: 'Mains',
      restaurantId: cairoCoffee.id,
      image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'item-10',
      name: 'Date & Walnut Scone',
      description: 'Warm, buttery scone baked with sweet Egyptian dates.',
      price: 40.00,
      category: 'Appetizers',
      restaurantId: cairoCoffee.id,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
      },
      create: item,
    })
  }

  console.log('✅ Seeding completed successfully.')
}

main()
  .catch((e: unknown) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
