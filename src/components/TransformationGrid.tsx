import type { HeadshotPreset } from "../types";
import { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";
import { AdvancedImage, lazyload, placeholder } from "@cloudinary/react";
import { cn } from "../lib/utils";
import { Check } from "lucide-react";

interface PresetImage {
    preset: HeadshotPreset;
    image: CloudinaryImage
}

interface TransformationGridProps {
    title: string
    presets: PresetImage[]
    selectedPresetId: string | null
    onSelect: (id: string) => void
}

function PresetCard({
    preset,
    image,
    isSelected,
    onSelect
}: {
    preset: HeadshotPreset;
    image: CloudinaryImage;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <button onClick={onSelect}>
            <div
                className={cn(
                    "relative aspect-[4/5] w-full overflow-hidden bg-black/30 border-1 rounded-xl",
                    isSelected ? "border-indigo-500" : "border-transparent",
                )}
            >
                <AdvancedImage
                    cldImg={image}
                    plugins={[placeholder({ mode: "blur" }), lazyload()]}
                    alt="Orginal Upload"
                    className="mx-auto rounded-xl shadow-ig"
                />

                {isSelected && (
                    <div className="absolute right-2 top-2 rounded-full bg-indigo-600 p-1">
                        <Check className="h-4 w-4 text-white" />
                    </div>
                )}
            </div>

            <div className="p-4">
                <h4 className="font-semibold">{preset.name}</h4>
                <p className="mt-1 text-white/50">{preset.description}</p>
            </div>
        </button>
    )


}



export default function TransformationGrid({
    title,
    presets,
    onSelect,
    selectedPresetId
}: TransformationGridProps) {
    if (presets.length === 0) return null;

    return (
        <section className="px-4 py-12">
            <div className="mx-auto max-w-6xl">
                <h2 className="mb-2 text-center text-2xl font-semibold">{title}</h2>
                <p className="mb-8 text-center text-sm text-white/50">
                    Outfit swap . Background replace . optimized for web
                </p>
                <p className="mb-6 text-center text-xs text-amber-400/70">
                    styles generate one at a time (~30-60s each).
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {presets.map(({ preset, image }) => (
                        <PresetCard
                            preset={preset}
                            image={image}
                            isSelected={selectedPresetId === preset.id}
                            onSelect={() => onSelect(preset.id)}
                        />
                    ))}

                </div>
            </div>
        </section>
    );
}