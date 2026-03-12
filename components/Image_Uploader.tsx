"use client";
import React, { useState } from "react";

import axios from "axios";
const ImageUploader = () => {
  const [file, setFile] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("image/jpeg");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedImage = e.target.files?.[0];
    if (!uploadedImage) {
      setError("No File Selected");
      return;
    }
    if (!uploadedImage.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setMediaType(uploadedImage.type);
    setFile(URL.createObjectURL(uploadedImage));

    // Convert to base64 for the API
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      setBase64File(base64);
    };
    reader.readAsDataURL(uploadedImage);
  }

  async function handleSubmission() {
    if (!base64File) {
      setError("No image data available.");
      return;
    }
    setLoading(true);
    setResultImage(null);
    try {
      const data = { mediaType, base64File };
      const response = await axios.post("/api/imgToClaude", data);
      setResultImage(response.data.image);
    } catch (err) {
      console.error("Error during API call:", err);
      setError("Failed to process the image. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 items-center">
        {/* File Upload Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Add Image
          </h2>
          <input
            type="file"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <label
            htmlFor="fileUpload"
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-2 rounded-md cursor-pointer transition-colors duration-200 shadow-md"
          >
            Choose File
          </label>
        </div>

        {/* Main Content Area */}
        <div className="w-full">
          {file && (
            <div className="flex flex-col items-center gap-6">
              {/* Uploaded Image Preview */}
              <div className="w-full max-w-md lg:max-w-lg">
                <img
                  className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700"
                  src={file}
                  alt="uploaded image"
                />
              </div>

              {/* Convert Button */}
              <button
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-3 rounded-md text-lg font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                onClick={handleSubmission}
                disabled={loading}
              >
                {loading ? "Converting..." : "Convert"}
              </button>

              {/* Loader */}
              {loading && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
                    Analyzing floor plan and generating render...
                  </p>
                </div>
              )}

              {/* Result Section */}
              {resultImage && (
                <div className="flex flex-col items-center gap-4 w-full max-w-md lg:max-w-lg">
                  <p className="text-green-600 font-semibold text-lg">
                    Your 3D render is ready!
                  </p>
                  <div className="w-full">
                    <img
                      src={`data:image/png;base64,${resultImage}`}
                      alt="3D architectural render"
                      className="w-full h-auto rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-700"
                    />
                  </div>

                  <a
                    href={`data:image/png;base64,${resultImage}`}
                    download="architectural-render.png"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md font-medium cursor-pointer transition-colors duration-200 shadow-md"
                  >
                    Download Render
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
