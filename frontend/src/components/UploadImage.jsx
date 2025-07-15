import React, { useState, useRef } from 'react';
import { Upload, X, Plus, Check } from 'lucide-react';

const ImageUploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isImage && isValidSize;
    });

    const newFiles = validFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(file => file.id !== id);
      // Revoke object URL to prevent memory leaks
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const simulateUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate completion
    setTimeout(() => {
      setUploading(false);
      setUploadProgress(0);
      setSelectedFiles([]);
      alert('Images uploaded successfully!');
    }, 500);
  };

  const clearAll = () => {
    selectedFiles.forEach(file => {
      URL.revokeObjectURL(file.preview);
    });
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Upload Images</h2>
        <p className="text-gray-600">Drag and drop your images or click to browse</p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full transition-colors duration-300 ${
            isDragOver ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {isDragOver ? 'Drop images here' : 'Choose images to upload'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or drag and drop them here
            </p>
          </div>

          <button
            type="button"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Select Images
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-400">
          Supported formats: JPG, PNG, GIF, WebP • Max size: 5MB per image
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Selected Images ({selectedFiles.length})
            </h3>
            <button
              onClick={clearAll}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedFiles.map((file) => (
              <div
                key={file.id}
                className="relative group bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg"
              >
                <div className="aspect-square relative">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                  
                  <button
                    onClick={() => removeFile(file.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading...</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedFiles.length > 0 && !uploading && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={simulateUpload}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Check className="w-5 h-5 inline mr-2" />
            Upload {selectedFiles.length} Image{selectedFiles.length > 1 ? 's' : ''}
          </button>
          
          <button
            onClick={clearAll}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Upload Stats */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Images:</span>
            <span className="font-semibold text-gray-800">{selectedFiles.length}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">Total Size:</span>
            <span className="font-semibold text-gray-800">
              {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadForm;