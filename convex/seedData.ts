// Curated seed catalog of common Australian grocery staples.
//
// NOTE: This is a hand-crafted, representative dataset standing in for live
// Coles/Woolworths/Aldi pricing (none of the retailers offer a public price API).
// Prices are in AUD and reflect plausible 2024-25 shelf prices. The `*Special`
// flags mark items "on special this week" at that store. Aldi is modelled as
// everyday-low (mostly cheapest, few specials), while Coles/Woolworths rotate
// weekly specials. The data layer is isolated here so a real pricing adapter
// (scraper/API) could replace it later.

export type SeedProduct = {
  name: string;
  category: string;
  unit: string;
  aliases: string[];
  colesPrice: number;
  wooliesPrice: number;
  colesSpecial: boolean;
  wooliesSpecial: boolean;
  aldiPrice: number;
  aldiSpecial: boolean;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  // Dairy & Eggs
  { name: "Full Cream Milk 2L", category: "Dairy & Eggs", unit: "2L", aliases: ["milk", "full cream milk", "ww milk", "coles milk", "dairy milk", "fc milk"], colesPrice: 3.1, wooliesPrice: 3.1, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.99, aldiSpecial: false },
  { name: "Lite Milk 2L", category: "Dairy & Eggs", unit: "2L", aliases: ["lite milk", "light milk", "skim milk", "low fat milk"], colesPrice: 3.1, wooliesPrice: 3.15, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.99, aldiSpecial: false },
  { name: "Free Range Eggs 12pk", category: "Dairy & Eggs", unit: "12pk", aliases: ["eggs", "free range eggs", "dozen eggs", "egg carton"], colesPrice: 5.5, wooliesPrice: 4.9, colesSpecial: false, wooliesSpecial: true, aldiPrice: 4.79, aldiSpecial: false },
  { name: "Block Tasty Cheese 500g", category: "Dairy & Eggs", unit: "500g", aliases: ["cheese", "tasty cheese", "cheese block", "cheddar"], colesPrice: 7.0, wooliesPrice: 6.5, colesSpecial: false, wooliesSpecial: true, aldiPrice: 5.99, aldiSpecial: false },
  { name: "Greek Yoghurt 1kg", category: "Dairy & Eggs", unit: "1kg", aliases: ["yoghurt", "yogurt", "greek yoghurt", "natural yoghurt"], colesPrice: 6.0, wooliesPrice: 6.5, colesSpecial: true, wooliesSpecial: false, aldiPrice: 5.49, aldiSpecial: false },
  { name: "Butter 250g", category: "Dairy & Eggs", unit: "250g", aliases: ["butter", "salted butter", "spread"], colesPrice: 4.5, wooliesPrice: 4.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 3.99, aldiSpecial: false },

  // Bakery
  { name: "White Sandwich Bread 700g", category: "Bakery", unit: "700g", aliases: ["bread", "white bread", "sandwich bread", "loaf"], colesPrice: 3.0, wooliesPrice: 2.8, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.49, aldiSpecial: false },
  { name: "Wholemeal Bread 700g", category: "Bakery", unit: "700g", aliases: ["wholemeal bread", "brown bread", "multigrain bread"], colesPrice: 3.2, wooliesPrice: 3.4, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.69, aldiSpecial: false },
  { name: "Wraps 8pk", category: "Bakery", unit: "8pk", aliases: ["wraps", "tortillas", "flat bread"], colesPrice: 3.5, wooliesPrice: 3.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 2.99, aldiSpecial: false },

  // Fruit & Veg
  { name: "Bananas", category: "Fruit & Veg", unit: "per kg", aliases: ["banana", "bananas", "cavendish bananas"], colesPrice: 4.5, wooliesPrice: 4.9, colesSpecial: true, wooliesSpecial: false, aldiPrice: 4.29, aldiSpecial: false },
  { name: "Royal Gala Apples", category: "Fruit & Veg", unit: "per kg", aliases: ["apples", "gala apples", "royal gala"], colesPrice: 5.5, wooliesPrice: 5.0, colesSpecial: false, wooliesSpecial: false, aldiPrice: 4.99, aldiSpecial: false },
  { name: "Carrots 1kg", category: "Fruit & Veg", unit: "1kg", aliases: ["carrots", "carrot"], colesPrice: 2.0, wooliesPrice: 2.2, colesSpecial: false, wooliesSpecial: false, aldiPrice: 1.89, aldiSpecial: false },
  { name: "Brushed Potatoes 2kg", category: "Fruit & Veg", unit: "2kg", aliases: ["potatoes", "potato", "spuds"], colesPrice: 4.5, wooliesPrice: 4.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 3.99, aldiSpecial: false },
  { name: "Brown Onions 1kg", category: "Fruit & Veg", unit: "1kg", aliases: ["onions", "onion", "brown onions"], colesPrice: 2.5, wooliesPrice: 2.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.29, aldiSpecial: false },
  { name: "Baby Spinach 120g", category: "Fruit & Veg", unit: "120g", aliases: ["spinach", "baby spinach", "salad leaves"], colesPrice: 3.0, wooliesPrice: 3.5, colesSpecial: true, wooliesSpecial: false, aldiPrice: 2.99, aldiSpecial: false },
  { name: "Truss Tomatoes", category: "Fruit & Veg", unit: "per kg", aliases: ["tomatoes", "tomato", "truss tomatoes"], colesPrice: 6.0, wooliesPrice: 5.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 5.49, aldiSpecial: false },
  { name: "Avocado Each", category: "Fruit & Veg", unit: "each", aliases: ["avocado", "avo", "avocados"], colesPrice: 1.5, wooliesPrice: 1.2, colesSpecial: false, wooliesSpecial: true, aldiPrice: 1.29, aldiSpecial: false },

  // Meat & Seafood
  { name: "Chicken Breast 1kg", category: "Meat & Seafood", unit: "1kg", aliases: ["chicken", "chicken breast", "chicken fillets"], colesPrice: 11.0, wooliesPrice: 12.0, colesSpecial: true, wooliesSpecial: false, aldiPrice: 10.99, aldiSpecial: false },
  { name: "Beef Mince 1kg", category: "Meat & Seafood", unit: "1kg", aliases: ["beef mince", "mince", "ground beef"], colesPrice: 12.0, wooliesPrice: 11.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 10.99, aldiSpecial: false },
  { name: "Bacon 500g", category: "Meat & Seafood", unit: "500g", aliases: ["bacon", "rashers", "shortcut bacon"], colesPrice: 8.0, wooliesPrice: 7.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 6.49, aldiSpecial: false },
  { name: "Pork Sausages 6pk", category: "Meat & Seafood", unit: "6pk", aliases: ["sausages", "snags", "pork sausages"], colesPrice: 6.0, wooliesPrice: 6.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 5.49, aldiSpecial: false },
  { name: "Salmon Fillets 240g", category: "Meat & Seafood", unit: "240g", aliases: ["salmon", "salmon fillets", "fish"], colesPrice: 10.0, wooliesPrice: 9.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 9.99, aldiSpecial: false },

  // Pantry
  { name: "Spaghetti 500g", category: "Pantry", unit: "500g", aliases: ["spaghetti", "pasta", "spag"], colesPrice: 1.2, wooliesPrice: 1.2, colesSpecial: false, wooliesSpecial: false, aldiPrice: 0.85, aldiSpecial: false },
  { name: "Penne Pasta 500g", category: "Pantry", unit: "500g", aliases: ["penne", "pasta", "penne pasta"], colesPrice: 1.3, wooliesPrice: 1.1, colesSpecial: false, wooliesSpecial: true, aldiPrice: 0.85, aldiSpecial: false },
  { name: "Pasta Sauce 500g", category: "Pantry", unit: "500g", aliases: ["pasta sauce", "tomato sauce", "napoletana", "passata"], colesPrice: 2.5, wooliesPrice: 2.8, colesSpecial: true, wooliesSpecial: false, aldiPrice: 1.99, aldiSpecial: false },
  { name: "Basmati Rice 1kg", category: "Pantry", unit: "1kg", aliases: ["rice", "basmati rice", "basmati"], colesPrice: 4.0, wooliesPrice: 3.8, colesSpecial: false, wooliesSpecial: false, aldiPrice: 3.49, aldiSpecial: false },
  { name: "Weet-Bix 1.2kg", category: "Pantry", unit: "1.2kg", aliases: ["weetbix", "weet-bix", "cereal", "breakfast cereal"], colesPrice: 6.0, wooliesPrice: 5.5, colesSpecial: false, wooliesSpecial: true, aldiPrice: 4.99, aldiSpecial: false },
  { name: "Rolled Oats 1kg", category: "Pantry", unit: "1kg", aliases: ["oats", "rolled oats", "porridge"], colesPrice: 2.5, wooliesPrice: 2.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 1.99, aldiSpecial: false },
  { name: "Plain Flour 1kg", category: "Pantry", unit: "1kg", aliases: ["flour", "plain flour"], colesPrice: 1.8, wooliesPrice: 2.0, colesSpecial: false, wooliesSpecial: false, aldiPrice: 1.49, aldiSpecial: false },
  { name: "White Sugar 1kg", category: "Pantry", unit: "1kg", aliases: ["sugar", "white sugar", "caster sugar"], colesPrice: 2.2, wooliesPrice: 2.2, colesSpecial: false, wooliesSpecial: false, aldiPrice: 1.89, aldiSpecial: false },
  { name: "Olive Oil 750ml", category: "Pantry", unit: "750ml", aliases: ["olive oil", "oil", "evoo"], colesPrice: 9.0, wooliesPrice: 8.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 7.49, aldiSpecial: true },
  { name: "Tinned Tomatoes 400g", category: "Pantry", unit: "400g", aliases: ["tinned tomatoes", "canned tomatoes", "diced tomatoes"], colesPrice: 1.0, wooliesPrice: 1.1, colesSpecial: false, wooliesSpecial: false, aldiPrice: 0.69, aldiSpecial: false },
  { name: "Tuna Chunks 425g", category: "Pantry", unit: "425g", aliases: ["tuna", "tinned tuna", "canned tuna"], colesPrice: 3.5, wooliesPrice: 3.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 2.79, aldiSpecial: false },
  { name: "Peanut Butter 500g", category: "Pantry", unit: "500g", aliases: ["peanut butter", "pb", "nut spread"], colesPrice: 4.5, wooliesPrice: 4.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 3.49, aldiSpecial: false },

  // Drinks
  { name: "Ground Coffee 1kg", category: "Drinks", unit: "1kg", aliases: ["coffee", "ground coffee", "coffee beans"], colesPrice: 18.0, wooliesPrice: 20.0, colesSpecial: true, wooliesSpecial: false, aldiPrice: 16.99, aldiSpecial: true },
  { name: "Tea Bags 100pk", category: "Drinks", unit: "100pk", aliases: ["tea", "tea bags", "black tea"], colesPrice: 4.0, wooliesPrice: 3.5, colesSpecial: false, wooliesSpecial: true, aldiPrice: 2.99, aldiSpecial: false },
  { name: "Orange Juice 2L", category: "Drinks", unit: "2L", aliases: ["orange juice", "juice", "oj"], colesPrice: 4.5, wooliesPrice: 4.0, colesSpecial: false, wooliesSpecial: false, aldiPrice: 3.49, aldiSpecial: false },

  // Frozen
  { name: "Frozen Peas 1kg", category: "Frozen", unit: "1kg", aliases: ["frozen peas", "peas"], colesPrice: 3.0, wooliesPrice: 3.2, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.49, aldiSpecial: false },
  { name: "Frozen Chips 1.5kg", category: "Frozen", unit: "1.5kg", aliases: ["frozen chips", "chips", "fries", "oven chips"], colesPrice: 4.5, wooliesPrice: 4.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 3.79, aldiSpecial: false },
  { name: "Vanilla Ice Cream 2L", category: "Frozen", unit: "2L", aliases: ["ice cream", "vanilla ice cream"], colesPrice: 6.0, wooliesPrice: 5.0, colesSpecial: true, wooliesSpecial: true, aldiPrice: 4.99, aldiSpecial: false },

  // Household
  { name: "Toilet Paper 12pk", category: "Household", unit: "12pk", aliases: ["toilet paper", "loo paper", "tp", "toilet rolls"], colesPrice: 8.0, wooliesPrice: 7.5, colesSpecial: false, wooliesSpecial: true, aldiPrice: 6.49, aldiSpecial: false },
  { name: "Paper Towel 4pk", category: "Household", unit: "4pk", aliases: ["paper towel", "kitchen towel"], colesPrice: 5.0, wooliesPrice: 5.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 4.49, aldiSpecial: false },
  { name: "Dishwashing Liquid 900ml", category: "Household", unit: "900ml", aliases: ["dishwashing liquid", "dish soap", "detergent"], colesPrice: 3.5, wooliesPrice: 3.0, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.79, aldiSpecial: false },
  { name: "Laundry Liquid 2L", category: "Household", unit: "2L", aliases: ["laundry liquid", "laundry detergent", "washing liquid"], colesPrice: 12.0, wooliesPrice: 10.0, colesSpecial: true, wooliesSpecial: false, aldiPrice: 8.99, aldiSpecial: false },

  // Snacks
  { name: "Potato Chips 175g", category: "Snacks", unit: "175g", aliases: ["chips", "crisps", "potato chips"], colesPrice: 4.5, wooliesPrice: 4.0, colesSpecial: false, wooliesSpecial: true, aldiPrice: 2.99, aldiSpecial: false },
  { name: "Milk Chocolate Block 180g", category: "Snacks", unit: "180g", aliases: ["chocolate", "choc", "chocolate block", "cadbury"], colesPrice: 5.0, wooliesPrice: 4.5, colesSpecial: false, wooliesSpecial: false, aldiPrice: 2.99, aldiSpecial: false },
  { name: "Sweet Biscuits 200g", category: "Snacks", unit: "200g", aliases: ["biscuits", "cookies", "tim tams", "bikkies"], colesPrice: 3.5, wooliesPrice: 4.0, colesSpecial: true, wooliesSpecial: false, aldiPrice: 2.49, aldiSpecial: false },
];
