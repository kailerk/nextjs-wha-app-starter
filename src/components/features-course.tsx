import Image from "next/image";
import type { Course } from "@/services/course-service";

type Props = {
  courses: Course[];
}

const priceFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

const FeaturesCourse = ({ courses }: Props) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col px-6 py-14 sm:py-20">
      {/* Section title — QuestUI pattern */}
      <div className="text-center">
        <h2 className="font-heading font-bold text-4xl tracking-wide text-[#F5E6D3] sm:text-5xl">
          ห้องสมุดความรู้
        </h2>
        <p className="mt-3 text-[#BFA98A]">เลือกคัมภีร์และพัฒนาทักษะของนักผจญภัย</p>
        <div className="mt-4 mx-auto w-24 border-b border-dashed border-primary/40" />
      </div>

      <div className="mt-12 grid w-full gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group flex w-full flex-col rounded border border-[#5C3D2E] border-t-2 border-t-primary/50 bg-card overflow-hidden shadow-[0_2px_8px_rgba(202,138,4,0.18)] transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(202,138,4,0.28)]"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-[#1A0F0A]">
              <Image
                alt={course.title}
                className="size-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={course.picture}
                loading="eager"
              />
              {/* Gold overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A]/60 to-transparent opacity-60" />
            </div>

            <div className="flex flex-col gap-2 p-5">
              <span className="font-heading font-semibold text-base tracking-wide text-[#F5E6D3] leading-snug">
                {course.title}
              </span>
              <p className="text-sm text-[#BFA98A] line-clamp-2">
                {course.detail}
              </p>
              <p className="mt-2 font-heading text-xl font-bold text-primary">
                {course.price === 0 ? "ฟรี" : priceFormatter.format(course.price)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesCourse;
