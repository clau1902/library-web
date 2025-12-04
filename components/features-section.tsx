import { BookOpen, Heart, Truck } from "lucide-react";

const features = [
  {
    icon: <Truck size={20} />,
    title: "Free Shipping",
    description: "On all orders over $35",
  },
  {
    icon: <BookOpen size={20} />,
    title: "Curated Selection",
    description: "Hand-picked by our experts",
  },
  {
    icon: <Heart size={20} />,
    title: "Satisfaction Guaranteed",
    description: "30-day return policy",
  },
];

export function FeaturesSection() {
  return (
    <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className={`flex flex-col items-center text-center p-6 rounded-xl border border-border/50 bg-card/50 animate-fade-in-up stagger-${
            index + 1
          }`}
        >
          <div className="p-3 rounded-full bg-gold/10 text-gold mb-4">
            {feature.icon}
          </div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
