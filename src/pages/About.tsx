import Layout from '@/components/layout/Layout';
import { Wrench, Shield, Users, Truck } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="container py-16 max-w-4xl">
        <h1 className="font-heading text-4xl font-bold mb-4">
          About <span className="text-primary">FROG</span>WARD
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Mongolia's trusted source for industrial workwear and personal protective equipment.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {[
            { icon: Shield, title: 'Safety First', desc: 'Every product meets international safety standards — ANSI, NFPA, ASTM certified gear you can rely on.' },
            { icon: Wrench, title: 'Industrial Grade', desc: 'Built for mining, construction, manufacturing, and heavy industry environments across Mongolia.' },
            { icon: Users, title: 'B2B & B2C', desc: 'We serve individual workers and bulk enterprise orders with the same quality and speed.' },
            { icon: Truck, title: 'Nationwide Delivery', desc: 'Fast delivery to Ulaanbaatar and reliable shipping to all aimags across the country.' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-card p-6 space-y-3">
              <item.icon className="h-6 w-6 text-primary" />
              <h3 className="font-heading text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-8 space-y-4">
          <h2 className="font-heading text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            FrogWard was founded to solve a simple problem: getting high-quality safety equipment in Mongolia shouldn't be hard. 
            We source directly from certified manufacturers and deliver industrial workwear, PPE, and safety equipment 
            to workers and businesses who need reliable protection every day.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Whether you're outfitting a mining crew in Erdenet, a construction team in Darkhan, or need personal safety gear 
            in Ulaanbaatar — FrogWard has you covered with fast checkout via QPay and StorePay.
          </p>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Questions? Reach us at <span className="text-primary font-medium">contact@frogward.mn</span></p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
