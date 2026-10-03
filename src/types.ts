export type QrType = 'url' | 'text' | 'email' | 'phone' | 'wifi';

export interface UrlInputs {
  url: string;
}

export interface TextInputs {
  text: string;
}

export interface EmailInputs {
  address: string;
  subject: string;
  message: string;
}

export interface PhoneInputs {
  number: string;
}

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass';

export interface WifiInputs {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

export interface QrInputsMap {
  url: UrlInputs;
  text: TextInputs;
  email: EmailInputs;
  phone: PhoneInputs;
  wifi: WifiInputs;
}

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type ModuleShape = 'square' | 'rounded' | 'dot' | 'diamond' | 'connected';
export type FinderShape = 'square' | 'rounded' | 'circle-ring';
export type GradientType = 'none' | 'linear' | 'radial';
export type MadhubaniArtStyle = 'none' | 'katchni' | 'godna' | 'bharni';

export interface QrStyle {
  size: number; // 128 - 1024 px
  fgColor: string;
  bgColor: string;
  ecl: ErrorCorrectionLevel;
  margin: number; // 0 - 8 modules
  // Designer extensions
  moduleShape?: ModuleShape;
  finderShape?: FinderShape;
  gradientType?: GradientType;
  gradientColor?: string;
  artStyle?: MadhubaniArtStyle;
  paintedTexture?: boolean;
  bgImage?: string | null;
  bgImageOpacity?: number;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  style: QrStyle;
  badge?: string;
}

export type ReliabilityScore = 'good' | 'caution' | 'risky';

export interface ReliabilityReport {
  score: ReliabilityScore;
  contrastRatio: number;
  warnings: string[];
  errors: string[];
  canDownload: boolean; // false if errors.length > 0
  isInverted: boolean;
  isSmall: boolean;
  isLowMargin: boolean;
  isDense: boolean;
}

export interface ScanVerificationResult {
  checked: boolean;
  success: boolean;
  decodedText?: string;
  match: boolean;
  message: string;
}

// 3D Specific Types
export type ThreeCategory = 'scenes' | 'anime' | 'characters' | 'others';
export type ThreeModuleStyle = 'cube' | 'rounded' | 'cylinder';

export interface ThreeTheme {
  id: string;
  name: string;
  category: ThreeCategory;
  description: string;
  groundColor: string;
  moduleColor: string;
  accentColor: string;
  bgColor: string;
  ambientIntensity: number;
  roughness: number;
  metalness: number;
  previewGradient: string;
}

export interface ThreeSettings {
  themeId: string;
  depth: number;
  moduleStyle: ThreeModuleStyle;
  accentColor: string;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

// Template and Community
export interface Template {
  id: string;
  name: string;
  type: QrType;
  inputs: QrInputsMap[QrType];
  style: QrStyle;
  threeSettings?: ThreeSettings;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  authorId?: string;
  authorName?: string;
  originalAuthor?: string; // for remixed templates
}

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface CommunityPost {
  id: string;
  templateId: string;
  title: string;
  description: string;
  tags: string[];
  template: Template;
  author: {
    id: string;
    name: string;
    avatarColor: string;
  };
  likesCount: number;
  likedByMe: boolean;
  comments: CommunityComment[];
  createdAt: number;
  reported: boolean;
}

// Auth and User
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: number;
  isDemo?: boolean;
  following: string[]; // author IDs
}

export interface Session {
  user: User;
  token: string;
  expiresAt: number;
}

// Recent Item
export interface RecentItem {
  id: string;
  type: QrType;
  payload: string;
  inputs: QrInputsMap[QrType];
  style: QrStyle;
  summary: string;
  timestamp: number;
}
