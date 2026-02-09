"use client";

import { Button } from "@/components/ui/button";
import { PersonalizedRecommendation } from "@/lib/personalized-recommendation-engine";
import {
  Check,
  Download,
  Package,
  Printer,
  Share2,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface ShoppingListItem {
  productId: number;
  productName: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category: string;
}

interface SunyaCareShoppingListProps {
  recommendations: PersonalizedRecommendation[];
  onAddToCart?: (productId: number, quantity: number) => void;
}

export function SunyaCareShoppingList({
  recommendations,
  onAddToCart,
}: SunyaCareShoppingListProps) {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [duration, setDuration] = useState<"week" | "month">("week");
  const [showChecked, setShowChecked] = useState(true);

  const generateShoppingList = () => {
    const multiplier = duration === "week" ? 7 : 30;

    const items: ShoppingListItem[] = recommendations.map((rec) => {
      const dailyQuantity = rec.dailyQuantity;
      const totalQuantity = Math.round(dailyQuantity * multiplier);

      return {
        productId: rec.product.id,
        productName: rec.product.name,
        quantity: totalQuantity,
        unit: "g",
        checked: false,
        category: getCategory(rec.product.name),
      };
    });

    setShoppingList(items);
  };

  const getCategory = (productName: string): string => {
    const name = productName.toLowerCase();
    if (
      name.includes("nut") ||
      name.includes("almond") ||
      name.includes("cashew") ||
      name.includes("pistachio")
    ) {
      return "Nuts & Seeds";
    }
    if (
      name.includes("fruit") ||
      name.includes("mango") ||
      name.includes("apple") ||
      name.includes("banana") ||
      name.includes("kiwi") ||
      name.includes("strawberry") ||
      name.includes("blueberry") ||
      name.includes("pineapple") ||
      name.includes("papaya")
    ) {
      return "Dried Fruits";
    }
    if (name.includes("berry") || name.includes("cranberry")) {
      return "Berries";
    }
    return "Other";
  };

  const toggleItem = (productId: number) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, checked: !item.checked }
          : item,
      ),
    );
  };

  const removeItem = (productId: number) => {
    setShoppingList((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const clearChecked = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  const checkAll = () => {
    setShoppingList((prev) => prev.map((item) => ({ ...item, checked: true })));
  };

  const uncheckAll = () => {
    setShoppingList((prev) =>
      prev.map((item) => ({ ...item, checked: false })),
    );
  };

  const getTotalQuantity = () => {
    return shoppingList.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCheckedCount = () => {
    return shoppingList.filter((item) => item.checked).length;
  };

  const getEstimatedCost = () => {
    return shoppingList.reduce((sum, item) => {
      const product = recommendations.find(
        (r) => r.product.id === item.productId,
      );
      if (product) {
        const pricePerGram = product.product.nrsPrice / 1000;
        return sum + pricePerGram * item.quantity;
      }
      return sum;
    }, 0);
  };

  const exportShoppingList = () => {
    const content = generateShoppingListText();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sunya-care-shopping-list-${duration}-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateShoppingListText = (): string => {
    const categories = [...new Set(shoppingList.map((item) => item.category))];

    let content = `
══════════════════════════════════════════════════════════════
                    SUNYA CARE SHOPPING LIST
══════════════════════════════════════════════════════════════

Duration: ${duration === "week" ? "1 Week" : "1 Month"}
Generated: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    categories.forEach((category) => {
      const categoryItems = shoppingList.filter(
        (item) => item.category === category,
      );
      if (categoryItems.length > 0) {
        content += `\n📦 ${category}\n`;
        content += `${"─".repeat(50)}\n`;
        categoryItems.forEach((item) => {
          const status = item.checked ? "✓" : "○";
          content += `  ${status} ${item.productName.padEnd(30)} ${item.quantity}${item.unit}\n`;
        });
      }
    });

    content += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUMMARY:
  • Total Items: ${shoppingList.length}
  • Checked: ${getCheckedCount()}
  • Total Quantity: ${getTotalQuantity()}g
  • Estimated Cost: Rs. ${Math.round(getEstimatedCost()).toLocaleString()}

══════════════════════════════════════════════════════════════
                    Happy Shopping!
══════════════════════════════════════════════════════════════
`;
    return content;
  };

  const printShoppingList = () => {
    const content = generateShoppingListText();
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>SUNYA Care Shopping List</title>
          <style>
            body { font-family: monospace; white-space: pre; padding: 20px; }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareShoppingList = async () => {
    const text = generateShoppingListText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My SUNYA Care Shopping List",
          text: text,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Shopping list copied to clipboard!");
    }
  };

  const addAllToCart = () => {
    shoppingList.forEach((item) => {
      if (!item.checked) {
        onAddToCart?.(item.productId, item.quantity);
      }
    });
  };

  const categories = [...new Set(shoppingList.map((item) => item.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Shopping List</h3>
          <p className="text-sm text-gray-600">
            Generate your personalized shopping list
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#00C950]" />
          <span className="text-sm font-medium text-gray-700">
            {shoppingList.length} items
          </span>
        </div>
      </div>

      {/* Duration Selection */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-gray-900">Shopping Duration</h4>
            <p className="text-sm text-gray-600">
              Select how long you want to shop for
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDuration("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                duration === "week"
                  ? "bg-[#00C950] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              1 Week
            </button>
            <button
              onClick={() => setDuration("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                duration === "month"
                  ? "bg-[#00C950] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              1 Month
            </button>
          </div>
        </div>

        <Button
          onClick={generateShoppingList}
          className="w-full bg-gradient-to-r from-[#00C950] to-[#00A040] hover:from-[#00A040] hover:to-[#008030] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
        >
          <Package className="w-5 h-5 mr-2" />
          Generate Shopping List
        </Button>
      </div>

      {/* Shopping List */}
      {shoppingList.length > 0 && (
        <>
          {/* Summary Card */}
          <div className="bg-gradient-to-r from-[#00C950]/10 to-[#00A040]/10 rounded-xl p-4 border border-[#00C950]/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00C950]">
                  {shoppingList.length}
                </div>
                <div className="text-xs text-gray-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00C950]">
                  {getCheckedCount()}
                </div>
                <div className="text-xs text-gray-600">Checked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00C950]">
                  {getTotalQuantity()}g
                </div>
                <div className="text-xs text-gray-600">Total Weight</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00C950]">
                  Rs. {Math.round(getEstimatedCost()).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Est. Cost</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={checkAll}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Check All
            </Button>
            <Button
              onClick={uncheckAll}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              Uncheck All
            </Button>
            <Button
              onClick={clearChecked}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Checked
            </Button>
            <Button
              onClick={addAllToCart}
              size="sm"
              className="flex items-center gap-2 bg-[#00C950] hover:bg-[#00A040]"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </Button>
          </div>

          {/* Export/Share Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={exportShoppingList}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              onClick={printShoppingList}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              onClick={shareShoppingList}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {/* Shopping List Items */}
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryItems = shoppingList.filter(
                (item) => item.category === category,
              );
              if (!showChecked && categoryItems.every((item) => item.checked))
                return null;

              return (
                <div
                  key={category}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-lg">📦</span>
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.productId}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                          item.checked
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 hover:border-[#00C950]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <button
                            onClick={() => toggleItem(item.productId)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              item.checked
                                ? "bg-[#00C950] border-[#00C950] text-white"
                                : "border-gray-300 hover:border-[#00C950]"
                            }`}
                          >
                            {item.checked && <Check className="w-4 h-4" />}
                          </button>
                          <div className="flex-1">
                            <div
                              className={`font-medium ${item.checked ? "text-gray-500 line-through" : "text-gray-900"}`}
                            >
                              {item.productName}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.quantity}
                              {item.unit}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-2 hover:bg-red-100 rounded-full transition-colors text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Empty State */}
      {shoppingList.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            No Shopping List Yet
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Generate your personalized shopping list based on your
            recommendations
          </p>
          <Button
            onClick={generateShoppingList}
            className="bg-gradient-to-r from-[#00C950] to-[#00A040] hover:from-[#00A040] hover:to-[#008030] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Package className="w-5 h-5 mr-2" />
            Generate Shopping List
          </Button>
        </div>
      )}
    </div>
  );
}
