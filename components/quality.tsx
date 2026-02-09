import { Card } from "@/components/ui/card";
import { Award, Beaker, CheckCircle2, Leaf } from "lucide-react";

const certifications = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "No added sugar, no artificial preservatives, no chemicals. Pure dehydrated fruits only.",
  },
  {
    icon: Beaker,
    title: "Lab Tested",
    description: "All products tested for quality and safety. DFTQC approved.",
  },
  {
    icon: Award,
    title: "Hygienic Processing",
    description:
      "State-of-the-art dehydration facility meeting international food safety standards.",
  },
  {
    icon: CheckCircle2,
    title: "Nepal Food Regulated",
    description: "Compliant with Nepal Food Regulation. PAN and VAT certified.",
  },
];

export function Quality() {
  return (
    <section id="quality" className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Quality & Certifications
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We maintain the highest standards of quality and transparency.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <Card key={index} className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {cert.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
