import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { IUser, IMatch, ISettings } from "./types";
import { UserModel, MatchModel, SettingsModel } from "./models/MongoModels";

const MONGODB_URI = process.env.MONGODB_URI;

// Fallback JSON File DB
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "secret_santa.json");

interface LocalData {
  users: IUser[];
  matches: IMatch[];
  settings: ISettings;
}

const DEFAULT_SETTINGS: ISettings = {
  rules: `### 🎄 THỂ LỆ CUỘC CHƠI SECRET SANTA 🎁
1. **Bí mật tuyệt đối**: Không được tiết lộ người mình sẽ tặng quà cho bất kỳ ai cho đến ngày trao quà!
2. **Giá trị món quà**: Món quà nằm trong khoảng giá trị **dưới 200.000đ**, mọi người tự do chọn quà bất ngờ — ý nghĩa và chân thành là chính!
3. **Hình thức quà**: Quà phải được gói kín, ghi rõ **Họ tên & Bộ phận người nhận** (nhưng ký tên người tặng là *Secret Santa* 🎅).
4. **Thời hạn nộp quà**: Tất cả món quà phải được chuyển đến cây thông Noel công ty trước ngày diễn ra sự kiện.
5. **Thăm hình phạt**: Ai không chuẩn bị quà đúng hạn hoặc đoán sai danh tính Santa của mình tại buổi tiệc sẽ phải quay **Vòng Quay Hình Phạt**! 🎉`,
  eventDate: "2026-12-24T18:00:00",
  revealDate: "2026-11-27T00:00:00",
  companyDomain: "",
  companyName: "GLOBAL SAFE",
  companyLogo: "/assets/logo.png",
  penalties: [
    "Hát một bài hát Giáng sinh bất kỳ trước toàn thể công ty 🎤",
    "Uống 1 hơi hết ly nước ngọt/trà sữa 🥤",
    "Tạo dáng Ông già Noel chụp 3 kiểu ảnh đáng yêu 🎅",
    "Kể một bí mật hài hước hoặc tật xấu của bản thân ở công ty 🤫",
    "Nhảy vũ điệu Tuần lộc 30 giây cùng một đồng nghiệp bất kỳ 🦌",
    "Làm theo 1 yêu cầu bất kỳ từ người nhận quà của bạn ✨",
    "Mời người nhận quà 1 ly cà phê/trà sữa vào ngày hôm sau ☕",
    "Chúc Giáng sinh bằng 3 thứ tiếng khác nhau 🌍"
  ],
};

function readLocalData(): LocalData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const init: LocalData = {
        users: [],
        matches: [],
        settings: DEFAULT_SETTINGS,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2), "utf-8");
      return init;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || [],
      matches: parsed.matches || [],
      settings: parsed.settings || DEFAULT_SETTINGS,
    };
  } catch (error) {
    console.error("Error reading local db file:", error);
    return { users: [], matches: [], settings: DEFAULT_SETTINGS };
  }
}

function writeLocalData(data: LocalData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing local db file:", error);
  }
}

const globalForMongoose = globalThis as typeof globalThis & {
  __santaMongoosePromise?: Promise<typeof mongoose> | null;
};

function toIsoSafe(val: unknown): string | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return val.toISOString();
  const d = new Date(String(val));
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}

export async function isMongoAvailable(): Promise<boolean> {
  const uri = (process.env.MONGODB_URI || MONGODB_URI || "").trim();
  if (!uri) return false;
  if (mongoose.connection.readyState === 1) {
    return true;
  }
  try {
    if (!globalForMongoose.__santaMongoosePromise) {
      globalForMongoose.__santaMongoosePromise = mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
    }
    await globalForMongoose.__santaMongoosePromise;
    return Number(mongoose.connection.readyState) === 1;
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to local JSON store:", err);
    globalForMongoose.__santaMongoosePromise = null;
    return false;
  }
}

// ---------------- USER OPERATIONS ----------------
interface LeanUser {
  _id: { toString(): string };
  name: string;
  email: string;
  phoneLast4: string;
  department: string;
  avatar?: string;
  bio?: string;
  wishlist?: string;
  questions?: { question: string; answer: string }[];
  hasViewed?: boolean;
  viewedAt?: Date | string;
  createdAt?: Date | string;
}

interface LeanMatch {
  _id: { toString(): string };
  santaId: string;
  santaName: string;
  santaEmail: string;
  santaDepartment: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientDepartment: string;
  hints?: string[];
  matchedAt?: Date | string;
}

interface LeanSettings {
  rules?: string;
  eventDate?: string;
  revealDate?: string;
  companyDomain?: string;
  companyName?: string;
  companyLogo?: string;
  penalties?: string[];
}

export async function getUsers(): Promise<IUser[]> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const docs = await UserModel.find().sort({ createdAt: -1 }).lean<LeanUser[]>();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phoneLast4: doc.phoneLast4,
      department: doc.department,
      avatar: doc.avatar || "",
      bio: doc.bio || "",
      wishlist: doc.wishlist || "",
      questions: doc.questions || [],
      hasViewed: doc.hasViewed || false,
      viewedAt: toIsoSafe(doc.viewedAt),
      createdAt: toIsoSafe(doc.createdAt),
    }));
  }
  return readLocalData().users;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const cleanEmail = email.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc = await UserModel.findOne({ email: cleanEmail }).lean<LeanUser | null>();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phoneLast4: doc.phoneLast4,
      department: doc.department,
      avatar: doc.avatar || "",
      bio: doc.bio || "",
      wishlist: doc.wishlist || "",
      questions: doc.questions || [],
      hasViewed: doc.hasViewed || false,
      viewedAt: toIsoSafe(doc.viewedAt),
      createdAt: toIsoSafe(doc.createdAt),
    };
  }
  const users = readLocalData().users;
  return users.find((u) => u.email.toLowerCase().trim() === cleanEmail) || null;
}

export async function markUserViewed(email: string): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    await UserModel.updateOne(
      { email: cleanEmail },
      { $set: { hasViewed: true, viewedAt: new Date() } }
    );
    return;
  }
  const data = readLocalData();
  const user = data.users.find((u) => u.email.toLowerCase().trim() === cleanEmail);
  if (user) {
    user.hasViewed = true;
    user.viewedAt = new Date().toISOString();
    writeLocalData(data);
  }
}

export async function bulkSaveUsers(users: IUser[]): Promise<void> {
  if (users.length === 0) return;
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    // Single bulkWrite round-trip instead of N sequential queries (prevents Vercel 10s timeout)
    await UserModel.bulkWrite(
      users.map((u) => {
        const cleanEmail = u.email.toLowerCase().trim();
        return {
          updateOne: {
            filter: { email: cleanEmail },
            update: {
              $set: {
                name: u.name,
                email: cleanEmail,
                phoneLast4: u.phoneLast4,
                department: u.department,
                avatar: u.avatar || "",
                bio: u.bio || "",
                wishlist: u.wishlist || "",
                questions: u.questions || [],
              },
              $setOnInsert: {
                hasViewed: false,
              },
            },
            upsert: true,
          },
        };
      })
    );
    return;
  }
  const data = readLocalData();
  for (const nu of users) {
    const idx = data.users.findIndex(
      (u) => u.email.toLowerCase().trim() === nu.email.toLowerCase().trim()
    );
    if (idx >= 0) {
      data.users[idx] = { ...data.users[idx], ...nu };
    } else {
      data.users.push({
        ...nu,
        id: nu.id || `u_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      });
    }
  }
  writeLocalData(data);
}

export async function clearUsers(): Promise<void> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    await UserModel.deleteMany({});
    await MatchModel.deleteMany({});
    return;
  }
  const data = readLocalData();
  data.users = [];
  data.matches = [];
  writeLocalData(data);
}

// ---------------- MATCH OPERATIONS ----------------
export async function getMatches(): Promise<IMatch[]> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const docs = await MatchModel.find().lean<LeanMatch[]>();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      santaId: doc.santaId,
      santaName: doc.santaName,
      santaEmail: doc.santaEmail,
      santaDepartment: doc.santaDepartment,
      recipientId: doc.recipientId,
      recipientName: doc.recipientName,
      recipientEmail: doc.recipientEmail,
      recipientDepartment: doc.recipientDepartment,
      hints: doc.hints || [],
      matchedAt: toIsoSafe(doc.matchedAt) || new Date().toISOString(),
    }));
  }
  return readLocalData().matches;
}

export async function getMatchForSanta(santaEmail: string): Promise<IMatch | null> {
  const cleanEmail = santaEmail.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc = await MatchModel.findOne({ santaEmail: cleanEmail }).lean<LeanMatch | null>();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      santaId: doc.santaId,
      santaName: doc.santaName,
      santaEmail: doc.santaEmail,
      santaDepartment: doc.santaDepartment,
      recipientId: doc.recipientId,
      recipientName: doc.recipientName,
      recipientEmail: doc.recipientEmail,
      recipientDepartment: doc.recipientDepartment,
      hints: doc.hints || [],
      matchedAt: toIsoSafe(doc.matchedAt) || new Date().toISOString(),
    };
  }
  const matches = readLocalData().matches;
  return matches.find((m) => m.santaEmail.toLowerCase().trim() === cleanEmail) || null;
}

export async function getMatchForRecipient(recipientEmail: string): Promise<IMatch | null> {
  const cleanEmail = recipientEmail.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc = await MatchModel.findOne({ recipientEmail: cleanEmail }).lean<LeanMatch | null>();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      santaId: doc.santaId,
      santaName: doc.santaName,
      santaEmail: doc.santaEmail,
      santaDepartment: doc.santaDepartment,
      recipientId: doc.recipientId,
      recipientName: doc.recipientName,
      recipientEmail: doc.recipientEmail,
      recipientDepartment: doc.recipientDepartment,
      hints: doc.hints || [],
      matchedAt: toIsoSafe(doc.matchedAt) || new Date().toISOString(),
    };
  }
  const matches = readLocalData().matches;
  return matches.find((m) => m.recipientEmail.toLowerCase().trim() === cleanEmail) || null;
}

export async function saveMatches(matches: IMatch[]): Promise<void> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    await MatchModel.deleteMany({});
    if (matches.length > 0) {
      await MatchModel.insertMany(
        matches.map((m) => ({
          santaId: m.santaId,
          santaName: m.santaName,
          santaEmail: m.santaEmail.toLowerCase().trim(),
          santaDepartment: m.santaDepartment,
          recipientId: m.recipientId,
          recipientName: m.recipientName,
          recipientEmail: m.recipientEmail.toLowerCase().trim(),
          recipientDepartment: m.recipientDepartment,
          hints: m.hints,
          matchedAt: new Date(),
        }))
      );
    }
    return;
  }
  const data = readLocalData();
  data.matches = matches;
  writeLocalData(data);
}

export async function clearMatches(): Promise<void> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    await MatchModel.deleteMany({});
    return;
  }
  const data = readLocalData();
  data.matches = [];
  writeLocalData(data);
}

// ---------------- SETTINGS OPERATIONS ----------------
export async function getSettings(): Promise<ISettings> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc = await SettingsModel.findOneAndUpdate(
      { key: "global" },
      { $setOnInsert: { key: "global", ...DEFAULT_SETTINGS } },
      { upsert: true, returnDocument: "after" }
    ).lean<LeanSettings | null>();
    return {
      rules: doc?.rules || DEFAULT_SETTINGS.rules,
      eventDate: doc?.eventDate || DEFAULT_SETTINGS.eventDate,
      revealDate: doc?.revealDate || DEFAULT_SETTINGS.revealDate,
      companyDomain: doc?.companyDomain || "",
      companyName: doc?.companyName || DEFAULT_SETTINGS.companyName,
      companyLogo: doc?.companyLogo ?? DEFAULT_SETTINGS.companyLogo,
      penalties: doc?.penalties && doc.penalties.length > 0 ? doc.penalties : DEFAULT_SETTINGS.penalties,
    };
  }
  const data = readLocalData();
  return {
    ...DEFAULT_SETTINGS,
    ...(data.settings || {}),
  };
}

export async function updateSettings(partial: Partial<ISettings>): Promise<ISettings> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const updated = await SettingsModel.findOneAndUpdate(
      { key: "global" },
      { $set: partial },
      { upsert: true, returnDocument: "after" }
    ).lean<LeanSettings | null>();
    return {
      rules: updated?.rules || DEFAULT_SETTINGS.rules,
      eventDate: updated?.eventDate || DEFAULT_SETTINGS.eventDate,
      revealDate: updated?.revealDate || DEFAULT_SETTINGS.revealDate,
      companyDomain: updated?.companyDomain || "",
      companyName: updated?.companyName || DEFAULT_SETTINGS.companyName,
      companyLogo: updated?.companyLogo ?? DEFAULT_SETTINGS.companyLogo,
      penalties: updated?.penalties || DEFAULT_SETTINGS.penalties,
    };
  }
  const data = readLocalData();
  data.settings = { ...data.settings, ...partial };
  writeLocalData(data);
  return data.settings;
}
