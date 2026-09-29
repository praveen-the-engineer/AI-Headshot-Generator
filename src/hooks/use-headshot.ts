import { useState } from "react";
import type { uploadStatus } from "../types";
import type { CloudinaryUploadResult } from "../cloudinary/UploadWidget";
import { useMemo } from "react";
import { buildOriginalPreview } from "../lib/transformations"
import { ALL_PRESETS } from "../lib/transformations"
import getPresetById from "../lib/transformations"
import type { CloudinaryImage } from "@cloudinary/url-gen/index";

export function useHeadshot() {

    const [uploadStatus, setUploadStatus] = useState<uploadStatus>("idle");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [publicId, setPublicId] = useState<string | null>(null);
    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

    const handleUploadStart = () => {
        setUploadStatus('uploading');
        setUploadError(null);
    };

    const handleUploadSuccess = (result: CloudinaryUploadResult) => {
        if (result.resource_type !== "image") {
            setUploadStatus("error");
            setUploadError("Please Upload an image file(JPG, PNG, or WEBP).");
            return;
        }
        setPublicId(result.public_id);
        setSelectedPresetId(null);
        setUploadStatus("success");
        setUploadError(null);
    };

    const handleUploadError = (error: Error) => {
        setUploadStatus("error");
        setUploadError(error.message);
    };

    const originalImage = useMemo(() => {
        if (!publicId) return null;
        return buildOriginalPreview(publicId)
    }, [!publicId]);

    const presetImages = useMemo(() => {
        if (!publicId) return [];
        return ALL_PRESETS.map((preset) => ({
            preset,
            image: preset.build(publicId),
        }))
    }, [publicId]);

    const selectedPreset = selectedPresetId
        ? (getPresetById(selectedPresetId) ?? null)
        : null;

    const selectedImage: CloudinaryImage | null = useMemo(() => {
        if (!publicId || !selectedPreset) return null;
        return selectedPreset.build(publicId);
    }, [publicId, selectedPreset])

    return {
        uploadError,
        uploadStatus,
        handleUploadStart,
        handleUploadError,
        handleUploadSuccess,
        originalImage,
        presetImages,
        hasUpload: Boolean(publicId),
        selectPreset: setSelectedPresetId,
        selectedPresetId,
        selectedImage,
        selectedPreset,
        publicId
    };
}