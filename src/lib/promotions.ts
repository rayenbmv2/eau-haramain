import productWater from "@/assets/product-water.jpg";

export type Promotion = {
  id: string;
  name: string;
  size: string;
  packQty: number;
  priceTnd: number;
  oldPriceTnd: number;
  image: string;
};

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo-vivian-2l",
    name: "Vivian",
    size: "2 L",
    packQty: 3,
    priceTnd: 12.0,
    oldPriceTnd: 4.3,
    image: productWater,
  },
  {
    id: "promo-melina-2l",
    name: "Melina",
    size: "2 L",
    packQty: 3,
    priceTnd: 12.0,
    oldPriceTnd: 4.3,
    image: productWater,
  },
  {
    id: "promo-pristine-2l",
    name: "Pristine",
    size: "2 L",
    packQty: 3,
    priceTnd: 12.0,
    oldPriceTnd: 4.3,
    image: productWater,
  },
];
