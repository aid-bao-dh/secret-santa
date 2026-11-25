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
2. **Giá trị món quà**: Món quà nên nằm trong khoảng **100.000đ - 250.000đ**, ý nghĩa và chân thành là chính.
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

let isConnected = false;

export async function isMongoAvailable(): Promise<boolean> {
  const uri = process.env.MONGODB_URI || MONGODB_URI;
  if (!uri) return false;
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return true;
  }
  try {
    await mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    return true;
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to local JSON store:", err);
    isConnected = false;
    return false;
  }
}

// ---------------- USER OPERATIONS ----------------
export async function getUsers(): Promise<IUser[]> {
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const docs = await UserModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc: any) => ({
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
      viewedAt: doc.viewedAt ? doc.viewedAt.toISOString() : undefined,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : undefined,
    }));
  }
  return readLocalData().users;
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  const cleanEmail = email.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc: any = await UserModel.findOne({ email: cleanEmail }).lean();
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
      viewedAt: doc.viewedAt ? doc.viewedAt.toISOString() : undefined,
      createdAt: doc.createdAt ? doc.createdAt.toISOString() : undefined,
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
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    for (const u of users) {
      await UserModel.findOneAndUpdate(
        { email: u.email.toLowerCase().trim() },
        {
          name: u.name,
          email: u.email.toLowerCase().trim(),
          phoneLast4: u.phoneLast4,
          department: u.department,
          avatar: u.avatar || "",
          bio: u.bio || "",
          wishlist: u.wishlist || "",
          questions: u.questions || [],
        },
        { upsert: true, new: true }
      );
    }
    return;
  }
  const data = readLocalData();
  // Upsert
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
    const docs = await MatchModel.find().lean();
    return docs.map((doc: any) => ({
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
      matchedAt: doc.matchedAt ? doc.matchedAt.toISOString() : new Date().toISOString(),
    }));
  }
  return readLocalData().matches;
}

export async function getMatchForSanta(santaEmail: string): Promise<IMatch | null> {
  const cleanEmail = santaEmail.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc: any = await MatchModel.findOne({ santaEmail: cleanEmail }).lean();
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
      matchedAt: doc.matchedAt ? doc.matchedAt.toISOString() : new Date().toISOString(),
    };
  }
  const matches = readLocalData().matches;
  return matches.find((m) => m.santaEmail.toLowerCase().trim() === cleanEmail) || null;
}

export async function getMatchForRecipient(recipientEmail: string): Promise<IMatch | null> {
  const cleanEmail = recipientEmail.toLowerCase().trim();
  const useMongo = await isMongoAvailable();
  if (useMongo) {
    const doc: any = await MatchModel.findOne({ recipientEmail: cleanEmail }).lean();
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
      matchedAt: doc.matchedAt ? doc.matchedAt.toISOString() : new Date().toISOString(),
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
    let doc: any = await SettingsModel.findOne({ key: "global" }).lean();
    if (!doc) {
      doc = await SettingsModel.create({ key: "global", ...DEFAULT_SETTINGS });
    }
    return {
      rules: doc.rules || DEFAULT_SETTINGS.rules,
      eventDate: doc.eventDate || DEFAULT_SETTINGS.eventDate,
      revealDate: doc.revealDate || DEFAULT_SETTINGS.revealDate,
      companyDomain: doc.companyDomain || "",
      companyName: doc.companyName || DEFAULT_SETTINGS.companyName,
      companyLogo: doc.companyLogo ?? DEFAULT_SETTINGS.companyLogo,
      penalties: doc.penalties && doc.penalties.length > 0 ? doc.penalties : DEFAULT_SETTINGS.penalties,
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
    const updated: any = await SettingsModel.findOneAndUpdate(
      { key: "global" },
      { $set: partial },
      { upsert: true, new: true }
    ).lean();
    return {
      rules: updated.rules,
      eventDate: updated.eventDate,
      revealDate: updated.revealDate,
      companyDomain: updated.companyDomain || "",
      companyName: updated.companyName || DEFAULT_SETTINGS.companyName,
      companyLogo: updated.companyLogo ?? DEFAULT_SETTINGS.companyLogo,
      penalties: updated.penalties || DEFAULT_SETTINGS.penalties,
    };
  }
  const data = readLocalData();
  data.settings = { ...data.settings, ...partial };
  writeLocalData(data);
  return data.settings;
}
