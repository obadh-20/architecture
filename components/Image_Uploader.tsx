"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Upload, Image as ImageIcon, Download, Sparkles } from "lucide-react";

const ImageUploader = () => {
  const [file, setFile] = useState<string | null>(null);
  const [base64File, setBase64File] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("image/jpeg");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);
  const handleFile = (uploadedImage: File) => {
    if (!uploadedImage.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    setFileName(uploadedImage.name);
    setMediaType(uploadedImage.type);
    setFile(URL.createObjectURL(uploadedImage));

    // Convert to base64 for the API
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      setBase64File(base64);
      setError(null);
    };
    reader.readAsDataURL(uploadedImage);
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadedImage = e.target.files?.[0];
    if (!uploadedImage) {
      setError("No File Selected");
      return;
    }
    handleFile(uploadedImage);
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setFile(null);
    setBase64File(null);
    setResultImage(null);
    setFileName("");
    setError(null);
  };

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
  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-600 dark:text-slate-300 text-center">
          Checking authentication...
        </p>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome to Archinect
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Please log in to start transforming your floor plans
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Log In
              </Button>
              <Button 
                onClick={() => router.push("/signup")}
                variant="outline"
                className="w-full border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold py-6 text-lg"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Upload Section */}
      <Card className="border-none shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                Upload Your Floor Plan
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                Drag & drop your image or click to browse
              </CardDescription>
            </div>
            {file && (
              <Button 
                variant="ghost" 
                onClick={handleReset}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                Reset
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!file ? (
            /* Drag & Drop Zone */
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                isDragging 
                  ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/10" 
                  : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <Upload className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Drop your image here
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    or click to browse files
                  </p>
                </div>
                <Button 
                  onClick={handleBrowseClick}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            </div>
          ) : (
            /* Preview Section */
            <div className="space-y-6">
              {/* File Info */}
              <div className="flex items-center gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/10">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-white">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{fileName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ready to process</p>
                </div>
              </div>

              {/* Image Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Original Floor Plan</Label>
                  <div className="relative group">
                    <img
                      src={file}
                      alt="uploaded image"
                      className="w-full h-auto rounded-lg shadow-lg border-2 border-slate-200 dark:border-slate-700 transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Action Area */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transform</Label>
                  <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center p-8">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
                        <Sparkles className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Ready to Transform</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Click convert to see your 3D render</p>
                      </div>
                      <Button
                        onClick={handleSubmission}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 text-lg shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Converting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-5 w-5" />
                            <span>Convert to 3D</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Result Section */}
      {resultImage && (
        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              Your 3D Architectural Render is Ready!
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Download your stunning architectural visualization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">3D Render Preview</Label>
                <div className="relative group">
                  <img
                    src={`data:image/png;base64,${resultImage}`}
                    alt="3D architectural render"
                    className="w-full h-auto rounded-lg shadow-xl border-2 border-slate-200 dark:border-slate-700 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Actions</Label>
                <div className="space-y-3">
                  <a
                    href={`data:image/png;base64,${resultImage}`}
                    download="architectural-render.png"
                    className="flex items-center gap-3 w-full p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-105"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download Render</span>
                  </a>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                  >
                    Create New Render
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-96 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center animate-spin">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Processing Your Floor Plan
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Our AI is analyzing your floor plan and generating a stunning 3D render...
                </p>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
