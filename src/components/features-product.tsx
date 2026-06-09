import CartButton from "@/app/(front)/components/CartButton";
import Image from "next/image";

export type ProductCardItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryName: string;
  imageName: string | null;
};

type Props = {
  products: ProductCardItem[];
};

function getProductImage(product: ProductCardItem) {
  return product.imageName
    ? `/product-image/${product.imageName}`
    : "/product-image/nopic.png";
}

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const FeaturesProduct = ({ products }: Props) => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col px-6 py-14 sm:py-20">
      {/* Section title — QuestUI pattern */}
      <div className="text-center">
        <h2 className="font-heading font-bold text-4xl tracking-wide text-[#F5E6D3] sm:text-5xl">
          คลังสินค้า
        </h2>
        <p className="mt-3 text-[#BFA98A]">เลือกไอเทมที่ต้องการแล้วเพิ่มลงคลัง</p>
        <div className="mt-4 mx-auto w-24 border-b border-dashed border-primary/40" />
      </div>

      {products.length === 0 ? (
        <div className="mt-12 rounded border border-dashed border-[#5C3D2E] bg-card px-6 py-12 text-center text-[#BFA98A]">
          ยังไม่มีสินค้าในฐานข้อมูล
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex rounded border border-[#5C3D2E] border-t-2 border-t-primary/50 bg-card px-6 py-7 shadow-[0_2px_8px_rgba(202,138,4,0.18)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(202,138,4,0.28)]"
            >
              <div className="flex w-full flex-col">
                <div className="relative mb-5 aspect-4/5 w-full overflow-hidden rounded bg-[#1A0F0A] sm:mb-6">
                  <Image
                    alt={product.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    src={getProductImage(product)}
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* ID chip */}
                  <span className="rounded border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-heading uppercase tracking-wider text-primary">
                    #{product.id}
                  </span>
                  {/* Category chip */}
                  <span className="rounded border border-[#5C3D2E] bg-[#3D2517] px-2.5 py-0.5 text-xs uppercase tracking-wider text-[#BFA98A]">
                    {product.categoryName}
                  </span>
                </div>

                <h3 className="mt-5 font-heading text-base font-semibold tracking-wide text-[#F5E6D3]">
                  {product.name}
                </h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-[#BFA98A]">
                  {product.description}
                </p>
                <p className="mt-4 font-heading text-2xl font-bold text-primary">
                  {priceFormatter.format(product.price)}
                </p>
                <div className="mt-auto">
                  <CartButton product={product} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturesProduct;
