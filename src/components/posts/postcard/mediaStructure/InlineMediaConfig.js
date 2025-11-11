import {
  FaFileAlt,
  FaFilePdf,
  FaMusic,
  FaImage,
  FaVideo,
  FaFile,
  FaCode,
  FaArchive,
  FaDatabase,
  FaCubes,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";

import {
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJson,
} from "react-icons/si";

// AI-Powered Media Classifier
export const MEDIA_CLASSIFIER = {
  // Images
  image: {
    types: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "ico"],
    icon: FaImage,
    color: "#10B981",
    category: "visual",
  },

  // Videos
  video: {
    types: ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv", "m4v"],
    icon: FaVideo,
    color: "#EF4444",
    category: "visual",
  },

  // Audio
  audio: {
    types: ["mp3", "wav", "ogg", "m4a", "flac", "aac", "wma"],
    icon: FaMusic,
    color: "#8B5CF6",
    category: "audio",
  },

  // Documents
  pdf: {
    types: ["pdf"],
    icon: FaFilePdf,
    color: "#DC2626",
    category: "document",
  },

  // Code Files
  code: {
    types: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "html",
      "css",
      "php",
      "rb",
      "go",
      "rs",
      "json"
    ],
    icons: {
      js: SiJavascript,
      jsx: SiJavascript,
      ts: SiJavascript,
      tsx: SiJavascript,
      py: SiPython,
      html: SiHtml5,
      css: SiCss3,
      json: SiJson,
    },
    defaultIcon: FaCode,
    color: "#F59E0B",
    category: "code",
  },

  // Office Documents
  office: {
    types: ["doc", "docx", "xls", "xlsx", "ppt", "pptx"],
    icons: {
      doc: FaFileWord,
      docx: FaFileWord,
      xls: FaFileExcel,
      xlsx: FaFileExcel,
      ppt: FaFilePowerpoint,
      pptx: FaFilePowerpoint,
    },
    defaultIcon: FaFileAlt,
    color: "#2563EB",
    category: "document",
  },

  // Archives
  archive: {
    types: ["zip", "rar", "7z", "tar", "gz"],
    icon: FaArchive,
    color: "#7C3AED",
    category: "archive",
  },

  // Data Files
  data: {
    types: ["csv", "xml", "sql", "db", "sqlite"],
    icon: FaDatabase,
    color: "#059669",
    category: "data",
  },

  // 3D & CAD
  model: {
    types: ["stl", "obj", "fbx", "blend", "max", "ma"],
    icon: FaCubes,
    color: "#DB2777",
    category: "model",
  },

  // Default
  unknown: {
    icon: FaFile,
    color: "#6B7280",
    category: "file",
  },
};

// Helper function to detect media type
export const detectMediaType = (mediaItem) => {
  if (mediaItem.media_type) return mediaItem.media_type;

  const fileExt = mediaItem.file?.split(".").pop()?.toLowerCase();
  if (!fileExt) return "unknown";

  for (const [type, config] of Object.entries(MEDIA_CLASSIFIER)) {
    if (config.types?.includes(fileExt)) {
      return type;
    }
  }

  return "unknown";
};

// Helper function to get media icon
export const getMediaIcon = (mediaType, fileExt) => {
  const config = MEDIA_CLASSIFIER[mediaType] || MEDIA_CLASSIFIER.unknown;

  if (config.icons && fileExt && config.icons[fileExt]) {
    return config.icons[fileExt];
  }

  return config.icon || FaFile;
};
