import productWater from "@/assets/product-water.jpg";
import vivianImg from "@/assets/vivan 1.5.png";
import melinaImg from "@/assets/melina 2L.webp";
import pristineImg from "@/assets/pristine 2l.webp";
import myTunisiaImg from "@/assets/MY TUNISIA 1.5.jpg";

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
    image: vivianImg,
  },
  {
    id: "promo-melina-2l",
    name: "Melina",
    size: "2 L",
    packQty: 3,
    priceTnd: 12.0,
    oldPriceTnd: 4.3,
    image: melinaImg,
  },
  {
    id: "promo-pristine-2l",
    name: "Pristine",
    size: "2 L",
    packQty: 3,
    priceTnd: 12.0,
    oldPriceTnd: 4.3,
    image: pristineImg,
  },
  {
    id: "promo-mytunisia-2l",
    name: "My Tunisia",
    size: "2 L",
    packQty: 3,
    priceTnd: 12.0,
    oldPriceTnd: 4.3,
    image: myTunisiaImg,
  },
];
