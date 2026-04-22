"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Hash, X } from "lucide-center"; // Lucide icons
import {
  Sparkles as SparklesIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  Hash as HashIcon,
  X as XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateTags } from "@/service/ai.service";

export default function GenerateTagsPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim() || !category.trim()) {
      toast.error("Title and category are required");
      return;
    }

    try {
      setLoading(true);
      const res = await generateTags({ title, category });

      if (res.success) {
        setTags(res.data.tags);
        toast.success("Tags generated!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate tags");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = async () => {
    if (tags.length === 0) return;
    await navigator.clipboard.writeText(tags.join(", "));
    setCopiedAll(true);
    toast.success("All tags copied!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const copySingle = (tag: string) => {
    navigator.clipboard.writeText(tag);
    toast.success(`Copied "${tag}"`);
  };

  const removeTag = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header section matches Description UI */}
      <div>
        <h1 className="text-2xl font-bold">AI Tag Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate SEO-friendly keywords and tags for your products
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Card - Matches Description UI spacing and styles */}
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
                placeholder="e.g. Samsung Galaxy S24 Ultra"
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

            {/* Button matches Description Page exactly */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full mt-10 gap-2"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Generating...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Generate Tags
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Output Card - Matches Description UI functionality */}
        <Card className="py-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Generated Tags</CardTitle>
              {tags.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAll}
                  className="gap-1.5"
                >
                  {copiedAll ? (
                    <CheckIcon className="h-3.5 w-3.5" />
                  ) : (
                    <CopyIcon className="h-3.5 w-3.5" />
                  )}
                  {copiedAll ? "Copied!" : "Copy All"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground border border-border"
                  >
                    <button
                      onClick={() => copySingle(tag)}
                      className="hover:opacity-70 transition-opacity"
                      title="Click to copy"
                    >
                      # {tag}
                    </button>
                    <button
                      onClick={() => removeTag(i)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Remove"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <HashIcon className="mb-3 h-12 w-12 opacity-20" />
                <p className="text-sm">
                  Enter product details to generate SEO tags
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
