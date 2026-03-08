import { Link, useSearchParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "az", label: "A–Z" },
];

const AssetLibrary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [stateFilter, setStateFilter] = useState(searchParams.get("state") || "All");
  const [substanceFilter, setSubstanceFilter] = useState(searchParams.get("substance") || "All");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const { data: assets = [], isLoading, isError } = useQuery({
    queryKey: ["assets-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_active", true)
        .order("state")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: bundles = [] } = useQuery({
    queryKey: ["assets-bundles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("is_bundle", true);
      if (error) throw error;
      return data;
    },
  });

  const categories = useMemo(() => ["All", ...Array.from(new Set(assets.map((a) => a.category))).sort()], [assets]);
  const stateOptions = useMemo(() => ["All", ...Array.from(new Set(assets.map((a) => a.state))).sort()], [assets]);
  const substanceOptions = useMemo(() => ["All", ...Array.from(new Set(assets.map((a) => a.substance))).sort()], [assets]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "All") params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  const filteredAssets = useMemo(() => {
    let result = [...assets];
    if (category !== "All") result = result.filter((a) => a.category === category);
    if (stateFilter !== "All") result = result.filter((a) => a.state === stateFilter || a.state === "All States");
    if (substanceFilter !== "All") result = result.filter((a) => a.substance === substanceFilter || a.substance === "All");
    if (sort === "price-low") result.sort((a, b) => a.price - b.price);
    if (sort === "price-high") result.sort((a, b) => b.price - a.price);
    if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [assets, category, stateFilter, substanceFilter, sort]);

  return (
    <main className="pb-16 md:pb-0">
      {/* Hero */}
      <section className="section-padding py-20 md:py-28">
        <div className="container-wide max-w-3xl">
          <h1 className="heading-1 text-foreground">The Compliance Asset Library</h1>
          <p className="mt-6 body-lg text-muted-foreground">
            Individual templates, SOPs, and guides — or save with a bundle. Instant download after purchase.
          </p>
        </div>
      </section>

      {/* Bundles */}
      {bundles.length > 0 && (
        <section className="section-padding pb-16">
          <div className="container-wide">
            <h2 className="heading-3 text-foreground mb-8">Featured bundles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {bundles.map((bundle) => (
                <Link
                  key={bundle.slug}
                  to={`/assets/${bundle.slug}`}
                  className="bg-primary text-primary-foreground rounded-xl p-8 hover:bg-forest-light transition-colors"
                >
                  <span className="text-xs font-sans font-medium bg-gold/20 text-gold px-2 py-1 rounded">Bundle</span>
                  <h3 className="font-serif text-2xl font-medium mt-4 mb-3">{bundle.title}</h3>
                  <p className="body-sm opacity-80 mb-4">{bundle.bundle_contents}</p>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-2xl font-bold">${bundle.price}</span>
                    {bundle.bundle_value && (
                      <span className="font-sans text-sm line-through opacity-50">${bundle.bundle_value} value</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="section-padding sticky top-16 md:top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="container-wide flex flex-wrap gap-3 items-center">
          <Select value={category} onValueChange={(v) => { setCategory(v); updateFilter("category", v); }}>
            <SelectTrigger className="w-44 font-sans text-sm"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={(v) => { setStateFilter(v); updateFilter("state", v); }}>
            <SelectTrigger className="w-36 font-sans text-sm"><SelectValue placeholder="State" /></SelectTrigger>
            <SelectContent>
              {stateOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={substanceFilter} onValueChange={(v) => { setSubstanceFilter(v); updateFilter("substance", v); }}>
            <SelectTrigger className="w-36 font-sans text-sm"><SelectValue placeholder="Substance" /></SelectTrigger>
            <SelectContent>
              {substanceOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => { setSort(v); updateFilter("sort", v); }}>
            <SelectTrigger className="w-44 font-sans text-sm"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              {sortOptions.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="font-sans text-sm text-muted-foreground ml-auto">{filteredAssets.length} results</span>
        </div>
      </section>

      {/* Product Grid */}
      <section className="section-padding section-spacing">
        <div className="container-wide">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-3">
                  <div className="flex gap-2"><Skeleton className="h-5 w-16" /><Skeleton className="h-5 w-14" /></div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex justify-between pt-3"><Skeleton className="h-6 w-12" /><Skeleton className="h-7 w-20" /></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <p className="text-center body-base text-destructive py-16">Something went wrong loading assets. Please try again later.</p>
          ) : filteredAssets.length === 0 ? (
            <p className="text-center body-base text-muted-foreground py-16">No assets match your filters. Try adjusting your selection.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset, i) => (
                <motion.div
                  key={asset.slug}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/assets/${asset.slug}`}
                    className="block bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-md transition-all h-full"
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-sans font-medium bg-primary/10 text-primary px-2 py-1 rounded">{asset.category}</span>
                      <span className="text-xs font-sans font-medium bg-accent/20 text-accent-foreground px-2 py-1 rounded">{asset.state}</span>
                      <span className="text-xs font-sans font-medium bg-muted text-muted-foreground px-2 py-1 rounded">{asset.substance}</span>
                    </div>
                    <h3 className="font-serif text-lg font-medium text-foreground mb-3 leading-snug">{asset.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <span className="font-sans font-semibold text-foreground text-lg">${asset.price}</span>
                      <span className="font-sans text-sm font-medium bg-gold text-gold-foreground px-3 py-1 rounded">Buy now</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AssetLibrary;
