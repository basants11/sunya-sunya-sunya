"use client";

import { Button } from "@/components/ui/button";
import { RecommendationSummary } from "@/lib/personalized-recommendation-engine";
import {
  Check,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Share2,
  X,
} from "lucide-react";
import { useState } from "react";

interface SunyaCareExportShareProps {
  summary: RecommendationSummary;
  onClose?: () => void;
}

export function SunyaCareExportShare({
  summary,
  onClose,
}: SunyaCareExportShareProps) {
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "image" | "text">(
    "pdf",
  );
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate export

      if (exportFormat === "pdf") {
        exportAsPDF();
      } else if (exportFormat === "image") {
        exportAsImage();
      } else {
        exportAsText();
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = () => {
    // Create a printable version
    const printContent = generatePrintContent();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const exportAsImage = () => {
    // Use html2canvas or similar library for image export
    // For now, we'll create a downloadable text file
    const content = generateTextContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunya-care-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsText = () => {
    const content = generateTextContent();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunya-care-plan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateTextContent = (): string => {
    const { userProfile, dailyRequirements, dailyPackage, safetyAdvice } =
      summary;

    const content = `
═══════════════════════════════════════════════════════════════
                    SUNYA CARE PERSONALIZED NUTRITION PLAN
═══════════════════════════════════════════════════════════════

Generated on: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              YOUR PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Age: ${userProfile.age} years
Gender: ${userProfile.gender || "Not specified"}
Height: ${userProfile.height} cm
Weight: ${userProfile.weight} kg
Fitness Goal: ${userProfile.fitnessGoal.replace("-", " ").toUpperCase()}
Activity Level: ${userProfile.activityLevel.toUpperCase()}
Health Conditions: ${userProfile.healthConditions.join(", ") || "None"}
Dietary Preferences: ${userProfile.dietaryPreferences?.join(", ") || "None"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                         DAILY NUTRITION REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Calories: ${dailyRequirements.calories} kcal
Protein: ${dailyRequirements.protein} g
Carbohydrates: ${dailyRequirements.carbs} g
Fiber: ${dailyRequirements.fiber} g
Fat: ${dailyRequirements.fat} g
Vitamin C: ${dailyRequirements.vitaminC} mg
Potassium: ${dailyRequirements.potassium} mg
Magnesium: ${dailyRequirements.magnesium} mg
Vitamin B6: ${dailyRequirements.vitaminB6} mg
Antioxidants: ${dailyRequirements.antioxidants} ORAC units

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                      YOUR PERSONALIZED DAILY PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Products: ${dailyPackage.recommendations.length}
Total Calories: ${Math.round(dailyPackage.totalCalories)} kcal
Total Protein: ${Math.round(dailyPackage.totalProtein)} g
Total Carbs: ${Math.round(dailyPackage.totalCarbs)} g
Total Fiber: ${Math.round(dailyPackage.totalFiber)} g
Total Fat: ${Math.round(dailyPackage.totalFat)} g
Daily Price: Rs. ${dailyPackage.totalPrice.toLocaleString()}
Monthly Price: Rs. ${(dailyPackage.totalPrice * 30).toLocaleString()}
Coverage: ${dailyPackage.coveragePercentage}% of daily needs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           INCLUDED PRODUCTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${dailyPackage.recommendations
  .map(
    (rec, index) => `
${index + 1}. ${rec.product.name}
   Daily Quantity: ${rec.dailyQuantity}g (${rec.servings} servings)
   Reason: ${rec.reason}
   Benefits: ${rec.benefits.join(", ")}
   Safety: ${rec.safetyResult.safetyLevel.toUpperCase()}
   ${rec.safetyResult.microCopy}
`,
  )
  .join("")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                            SAFETY ADVICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${safetyAdvice}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                              DISCLAIMER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This personalized nutrition plan is for educational purposes only and should 
not replace professional medical advice. Always consult with your healthcare 
provider before making significant changes to your diet, especially if you 
have existing health conditions.

═══════════════════════════════════════════════════════════════
                    Powered by SUNYA Care Premium
═══════════════════════════════════════════════════════════════
`;
    return content;
  };

  const generatePrintContent = (): string => {
    const content = generateTextContent();
    return `
<!DOCTYPE html>
<html>
<head>
  <title>SUNYA Care Personalized Nutrition Plan</title>
  <style>
    body {
      font-family: 'Georgia', serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      text-align: center;
      color: #00C950;
      border-bottom: 3px solid #00C950;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    h2 {
      color: #00A040;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    .section {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #00C950;
    }
    .product {
      background: white;
      padding: 15px;
      margin: 10px 0;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
    }
    .disclaimer {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 6px;
      margin-top: 30px;
    }
    @media print {
      body { font-size: 12pt; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <pre style="font-family: 'Courier New', monospace; white-space: pre-wrap;">${content}</pre>
</body>
</html>
`;
  };

  const handleShare = async () => {
    const shareData = {
      title: "My SUNYA Care Personalized Nutrition Plan",
      text: `Check out my personalized SUNYA Care daily package with ${summary.dailyPackage.recommendations.length} premium products!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.href}?profile=${encodeURIComponent(JSON.stringify(summary.userProfile))}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFruitEmoji = (productName: string): string => {
    const name = productName.toLowerCase();
    if (name.includes("kiwi")) return "🥝";
    if (name.includes("blueberry")) return "🫐";
    if (name.includes("pineapple")) return "🍍";
    if (name.includes("papaya")) return "🥭";
    if (name.includes("apple")) return "🍎";
    if (name.includes("banana")) return "🍌";
    if (name.includes("mango")) return "🥭";
    if (name.includes("strawberry")) return "🍓";
    return "🍇";
  };

  return (
    <>
      <div className="flex gap-3">
        <Button
          onClick={() => setShowModal(true)}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2 premium-hover-lift"
        >
          <Download className="w-4 h-4" />
          Export Plan
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="flex-1 flex items-center justify-center gap-2 premium-hover-lift"
        >
          <Share2 className="w-4 h-4" />
          Share Plan
        </Button>
      </div>

      {/* Export Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowModal(false)}
          />
          <div className="relative premium-modal max-w-lg w-full p-6 animate-premium-scale-in">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00C950] to-[#00A040] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-premium-float">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Export Your Plan
              </h3>
              <p className="text-sm text-gray-600">
                Choose your preferred format to download your personalized
                nutrition plan
              </p>
            </div>

            {/* Package Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {summary.dailyPackage.recommendations
                      .slice(0, 4)
                      .map((rec) => (
                        <div
                          key={rec.product.id}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-lg border border-gray-200 shadow-sm"
                        >
                          {getFruitEmoji(rec.product.name)}
                        </div>
                      ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {summary.dailyPackage.recommendations.length} Products
                    </p>
                    <p className="text-xs text-gray-600">
                      Rs. {summary.dailyPackage.totalPrice.toLocaleString()}/day
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#00C950]">
                    {summary.dailyPackage.coveragePercentage}%
                  </div>
                  <div className="text-xs text-gray-600">Coverage</div>
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Select Export Format
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    value: "pdf",
                    label: "PDF",
                    icon: FileText,
                    desc: "Print-ready document",
                  },
                  {
                    value: "image",
                    label: "Image",
                    icon: ImageIcon,
                    desc: "Visual snapshot",
                  },
                  {
                    value: "text",
                    label: "Text",
                    icon: FileText,
                    desc: "Plain text file",
                  },
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setExportFormat(format.value as any)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      exportFormat === format.value
                        ? "border-[#00C950] bg-[#00C950]/10 shadow-md"
                        : "border-gray-200 hover:border-[#00C950]/50 hover:shadow-sm"
                    }`}
                  >
                    <format.icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        exportFormat === format.value
                          ? "text-[#00C950]"
                          : "text-gray-600"
                      }`}
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {format.label}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {format.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full premium-cta mb-3"
            >
              {isExporting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Export as {exportFormat.toUpperCase()}
                </>
              )}
            </Button>

            {/* Share Options */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Quick Share Options
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="flex items-center justify-center gap-2 premium-hover-lift"
                >
                  <Share2 className="w-4 h-4" />
                  Share via App
                </Button>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="flex items-center justify-center gap-2 premium-hover-lift"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Your personal data is used only to generate this plan and is not
              stored or shared.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
