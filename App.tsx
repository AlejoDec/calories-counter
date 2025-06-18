
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FoodCalorieInfo } from './types';
import { analyzeImageForCalories } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import CalorieResultCard from './components/CalorieResultCard';

// Utility to convert file to base64
const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve({ base64: result.split(',')[1], mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<FoodCalorieInfo[]>([]);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyOk, setApiKeyOk] = useState<boolean>(true); // Assume OK initially

  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check for API_KEY presence on mount
    if (!process.env.API_KEY) {
      setError("CRITICAL: API_KEY environment variable is not set. This application cannot function without it. Please configure the API_KEY.");
      setApiKeyOk(false);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResults([]);
    setTotalCalories(0);
    if (isCameraOpen) {
      closeCamera();
    }
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError("Invalid file type. Please upload an image (JPEG, PNG, GIF, WEBP).");
        setImageFile(null);
        setPreviewUrl(null);
        return;
      }
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl(null);
    }
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera API is not available on this browser.");
      return;
    }
    setError(null);
    setImageFile(null); 
    setPreviewUrl(null);
    setResults([]);
    setTotalCalories(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream; 
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setError("Camera permission denied. Please allow camera access in your browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
           setError("No camera found on this device. Ensure it's connected and enabled.");
        } else {
          setError(`Error accessing camera: ${err.message}`);
        }
      } else {
         setError("An unknown error occurred while trying to access the camera.");
      }
      setIsCameraOpen(false);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !isCameraOpen) return;
    setError(null);

    const videoNode = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = videoNode.videoWidth;
    canvas.height = videoNode.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoNode, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const photoFile = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setImageFile(photoFile);
          setPreviewUrl(URL.createObjectURL(photoFile));
          setResults([]);
          setTotalCalories(0);
          closeCamera(); 
        } else {
          setError("Could not capture photo. Blob creation failed.");
        }
      }, 'image/jpeg', 0.9);
    } else {
      setError("Could not get canvas context to capture photo.");
    }
  };

  const handleAnalyzeCalories = useCallback(async () => {
    if (!apiKeyOk) {
      setError("API Key not configured. Analysis cannot proceed.");
      return;
    }
    if (!imageFile) {
      setError("Please select an image or take a photo first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setTotalCalories(0);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const calorieData = await analyzeImageForCalories(base64, mimeType);
      setResults(calorieData);
      const sumCalories = calorieData.reduce((acc, item) => acc + (item.caloriesPerItem * item.quantity), 0);
      setTotalCalories(sumCalories);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred during analysis.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, apiKeyOk]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up object URL
      }
    };
  }, [previewUrl]); // Add previewUrl to dependency array for cleanup

  // Separate effect for camera stream cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 text-gray-800 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-4xl mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700 drop-shadow-md">
          AI Calorie Counter
        </h1>
        <p className="text-lg text-green-600 mt-2">
          Upload an image or take a photo of your meal and let AI estimate the calories!
        </p>
      </header>

      {!apiKeyOk && error && ( // This error is specifically for API Key issue
        <div className="w-full max-w-2xl p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700" role="alert">
          <p className="font-bold">Configuration Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <main className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 sm:p-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-700">1. Provide Your Image</h2>
            
            {!isCameraOpen && (
              <div>
                <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">
                  Choose an image file:
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  aria-label="Upload image file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  disabled={!apiKeyOk || isLoading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100 disabled:opacity-50"
                />
              </div>
            )}
            
            <p className="text-center text-gray-500 text-sm my-2">OR</p>

            <button
              onClick={isCameraOpen ? closeCamera : openCamera}
              disabled={!apiKeyOk || isLoading}
              aria-pressed={isCameraOpen ? "true" : "false"}
              className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isCameraOpen 
                ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500' 
                : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'
              }`}
            >
              {isCameraOpen ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6H8.25A2.25 2.25 0 006 8.25v7.5A2.25 2.25 0 008.25 18h7.5A2.25 2.25 0 0018 15.75V8.25A2.25 2.25 0 0015.75 6z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                     <line x1="1" y1="23" x2="23" y2="1" strokeWidth="2" /> {/* Diagonal line for "off" */}
                  </svg>
                  Close Camera
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  Open Camera
                </>
              )}
            </button>

            {isCameraOpen && (
              <div className="space-y-4 mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted // Good practice for autoplay
                  className="w-full h-auto max-h-72 object-contain rounded-md bg-gray-800" 
                  aria-label="Live camera feed"
                />
                <button
                  onClick={handleTakePhoto}
                  disabled={isLoading || !isCameraOpen}
                  className="w-full flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                     <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  Snap Photo
                </button>
              </div>
            )}

            {previewUrl && !isCameraOpen && (
              <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2">
                <img 
                  src={previewUrl} 
                  alt="Selected meal preview" 
                  className="w-full h-auto max-h-80 object-contain rounded-md" 
                />
              </div>
            )}

            <button
              onClick={handleAnalyzeCalories}
              disabled={!imageFile || isLoading || !apiKeyOk}
              className="w-full flex items-center justify-center bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              aria-live="polite"
            >
              {isLoading ? <LoadingSpinner /> : '2. Analyze Calories'}
            </button>
            {apiKeyOk && error && !error.startsWith("CRITICAL:") && ( // Show non-critical errors here related to input
              <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm" role="alert">
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-700">Results</h2>
            {isLoading && !results.length && (
              <div className="text-center py-8" aria-live="polite">
                <LoadingSpinner />
                <p className="mt-2 text-gray-600">Analyzing your image... this may take a moment.</p>
              </div>
            )}
            
            {!isLoading && results.length > 0 && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg shadow">
                  <h3 className="text-2xl font-bold text-green-800 text-center">
                    Total Estimated Calories: {totalCalories} kcal
                  </h3>
                </div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2" role="region" aria-label="Calorie breakdown">
                  {results.map((item, index) => (
                    <CalorieResultCard key={index} item={item} />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && !results.length && !error && !imageFile && apiKeyOk && (
              <div className="text-center py-8 text-gray-500">
                <p>Upload an image or use the camera, then click "Analyze Calories" to see results here.</p>
              </div>
            )}
             {!isLoading && !results.length && !error && imageFile && apiKeyOk && (
              <div className="text-center py-8 text-gray-500">
                <p>Click "Analyze Calories" to get started.</p>
              </div>
            )}
            {/* If error occurred during analysis, it will be shown in the input section error display */}
          </div>
        </div>
      </main>

      <footer className="w-full max-w-4xl mt-12 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Calorie Counter. Powered by Gemini.</p>
        <p>Calorie estimates are for informational purposes only and may not be 100% accurate.</p>
      </footer>
    </div>
  );
};

export default App;
