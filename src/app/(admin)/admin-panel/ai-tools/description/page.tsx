"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDescription } from "@/service/ai.service";

export default function GenerateDescriptionPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [specs, setSpecs] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setLoading(true);
      const specsArray = specs
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await generateDescription({
        title,
        category,
        brand: brand || undefined,
        specs: specsArray.length > 0 ? specsArray : undefined,
      });

      setResult(res.data.description);
      toast.success("Description generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Description Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate SEO-friendly product descriptions using AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <Card className="py-3">
          <CardHeader>
            <CardTitle className="text-base">Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Product Title <span className="text-destructive">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. iPhone 15 Pro Max 256GB"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Smartphones"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Brand</label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Specifications{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  (one per line)
                </span>
              </label>
              <textarea
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder={
                  "A17 Pro chip\n48MP camera system\n6.7-inch Super Retina XDR"
                }
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Description
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output */}
        <Card className="py-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Generated Description</CardTitle>
              {result && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-1.5"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Sparkles className="mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">
                  Fill in the product details and click generate
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
