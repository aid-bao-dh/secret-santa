"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Lock, Users, Shuffle, RefreshCw, Download, Upload, Trash2, CheckCircle2, AlertCircle, Database, ArrowLeft, Sparkles, FileSpreadsheet, Save } from "lucide-react";
import { IUser, IMatch, ISettings } from "@/lib/types";
import { downloadSampleTemplate, exportMasterExcel, parseUsersFromExcelBuffer } from "@/lib/excelHelper";

interface AdminStats {
  totalUsers: number;
  totalMatched: number;
  viewedCount: number;
}

interface AdminDashboardPayload {
  success: boolean;
  users?: IUser[];
  matches?: IMatch[];
  settings?: ISettings;
  isMongo?: boolean;
  stats?: AdminStats;
  message?: string;
}

const toDateTimeLocal = (val?: string, fallback = "2026-11-27T00:00") => {
  if (!val) return fallback;
  const m = val.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  return m ? m[1] : fallback;
};

const toIsoSeconds = (val: string) => {
  if (!val) return "";
  return val.length === 16 ? `${val}:00` : val;
};

export default function AdminPage() {
  const [token, setToken] = useState<string>("");
  const tokenRef = useRef<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [users, setUsers] = useState<IUser[]>([]);
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [isMongo, setIsMongo] = useState<boolean>(false);
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalMatched: 0, viewedCount: 0 });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Settings editing
  const [rulesDraft, setRulesDraft] = useState<string>("");
  const [revealDateDraft, setRevealDateDraft] = useState<string>("");
  const [eventDateDraft, setEventDateDraft] = useState<string>("");
  const [companyNameDraft, setCompanyNameDraft] = useState<string>("");
  const [companyLogoDraft, setCompanyLogoDraft] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = useCallback((authToken?: string, isJson = false): HeadersInit => {
    const headers: Record<string, string> = {};
    if (isJson) headers["Content-Type"] = "application/json";
    const resolved = authToken ?? tokenRef.current;
    if (resolved) headers["Authorization"] = `Bearer ${resolved}`;
    return headers;
  }, []);

  const applyDashboardData = useCallback((data: AdminDashboardPayload) => {
    setIsAuthenticated(true);
    setUsers(data.users || []);
    setMatches(data.matches || []);
    setIsMongo(Boolean(data.isMongo));
    setStats(data.stats || { totalUsers: 0, totalMatched: 0, viewedCount: 0 });
    if (data.settings) {
      setRulesDraft(data.settings.rules || "");
      setRevealDateDraft(toDateTimeLocal(data.settings.revealDate, "2026-11-27T00:00"));
      setEventDateDraft(toDateTimeLocal(data.settings.eventDate, "2026-12-24T18:00"));
      setCompanyNameDraft(data.settings.companyName || "GLOBAL SAFE");
      setCompanyLogoDraft(data.settings.companyLogo || "/assets/logo.png");
    }
  }, []);

  const fetchDashboard = useCallback(async (authToken?: string, silentOn401 = false) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data", {
        headers: getAuthHeaders(authToken),
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json().catch(() => null)) as AdminDashboardPayload | null;
      if (res.ok && data?.success) {
        applyDashboardData(data);
      } else if (res.status === 401) {
        sessionStorage.removeItem("admin_token");
        tokenRef.current = "";
        setToken("");
        setIsAuthenticated(false);
        if (!silentOn401) {
          setAuthError(data?.message || "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
        }
      } else {
        setMessage({
          type: "error",
          text: data?.message || `Không thể tải dữ liệu (HTTP ${res.status}). Hãy bấm nút làm mới ↻ ở góc bảng.`,
        });
      }
    } catch (err) {
      console.error(err);
      if (!silentOn401) {
        setMessage({ type: "error", text: "Lỗi kết nối máy chủ khi tải dữ liệu." });
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyDashboardData, getAuthHeaders]);

  // Check stored token or HttpOnly session cookie on mount (all setState calls happen async inside promise callback)
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token") || "";
    tokenRef.current = saved;
    void fetch("/api/admin/data", {
      headers: saved ? { Authorization: `Bearer ${saved}` } : undefined,
      credentials: "include",
      cache: "no-store",
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as AdminDashboardPayload | null;
        if (res.ok && data?.success) {
          setToken(saved);
          applyDashboardData(data);
        } else if (res.status === 401) {
          sessionStorage.removeItem("admin_token");
          tokenRef.current = "";
          setToken("");
          setIsAuthenticated(false);
        }
      })
      .catch(() => {});
  }, [applyDashboardData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        tokenRef.current = data.token;
        setToken(data.token);
        sessionStorage.setItem("admin_token", data.token);
        setIsAuthenticated(true);
        await fetchDashboard(data.token, false);
      } else {
        setAuthError(data.message || "Mật khẩu Admin không đúng.");
      }
    } catch {
      setAuthError("Lỗi kết nối máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  // Seed Mock Data
  const handleSeedMock = async () => {
    if (!confirm("Thao tác này sẽ nạp 6 nhân sự demo (Linh, Bảo, Nhi, Khoa, Hà, Dũng) và hủy kết quả ghép cặp cũ. Tiếp tục?")) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        fetchDashboard();
      } else {
        setMessage({ type: "error", text: data.message || "Lỗi nạp data mẫu." });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  // Run Matching Algorithm
  const handleRunMatch = async () => {
    if (users.length < 2) {
      alert("Cần tối thiểu 2 người trong danh sách để ghép cặp!");
      return;
    }
    if (matches.length > 0) {
      if (!confirm("Hiện đã có kết quả ghép cặp. Bạn có chắc muốn TẠO CẶP LẠI (Re-roll)? Mọi người sẽ được gán Santa mới!")) {
        return;
      }
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/match", {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        let text = data.message;
        if (data.warnings && data.warnings.length > 0) {
          text += " (" + data.warnings.join("; ") + ")";
        }
        setMessage({ type: "success", text });
        fetchDashboard();
      } else {
        setMessage({ type: "error", text: data.message || "Lỗi ghép cặp." });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Matching
  const handleResetMatch = async () => {
    if (!confirm("Bạn có chắc muốn HỦY kết quả ghép cặp hiện tại?")) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/match", {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        fetchDashboard();
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear All Data
  const handleClearAll = async () => {
    if (!confirm("CẢNH BÁO: Thao tác này sẽ XÓA TOÀN BỘ danh sách thành viên và kết quả ghép cặp!")) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message });
        fetchDashboard();
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  // Export Excel
  const handleExportExcel = () => {
    if (users.length === 0) {
      alert("Chưa có dữ liệu thành viên để xuất file.");
      return;
    }
    exportMasterExcel(users, matches);
  };

  // Download Sample Excel Template
  const handleDownloadTemplate = () => {
    downloadSampleTemplate();
  };

  // Import Excel File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const parsedUsers = parseUsersFromExcelBuffer(buffer);

        if (parsedUsers.length === 0) {
          alert("File Excel trống hoặc không đúng định dạng cột!");
          return;
        }

        setIsLoading(true);
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: getAuthHeaders(token, true),
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify(parsedUsers),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setMessage({ type: "success", text: data.message });
          fetchDashboard();
        } else {
          setMessage({ type: "error", text: data.message || "Lỗi lưu file import." });
        }
      } catch (err) {
        console.error(err);
        alert("Lỗi khi đọc file Excel. Vui lòng kiểm tra lại cấu trúc file!");
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Save Settings
  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: getAuthHeaders(token, true),
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          rules: rulesDraft,
          revealDate: toIsoSeconds(revealDateDraft),
          eventDate: toIsoSeconds(eventDateDraft),
          companyName: companyNameDraft,
          companyLogo: companyLogoDraft,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Đã lưu cài đặt thể lệ & thời gian!" });
        fetchDashboard();
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  // If NOT Authenticated, show Login Screen
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-stone-100 text-stone-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border-2 border-red-500/30 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <img src="/assets/logo.png" alt="GLOBAL SAFE" className="h-12 mx-auto mb-3 object-contain" />
            <h1 className="text-2xl font-black text-red-800">Quản Trị Secret Santa</h1>
            <p className="text-xs text-stone-500 mt-1 font-medium">GLOBAL SAFE • Ban Tổ Chức (Linh, Bảo, Nhi)</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Mật Khẩu Quản Trị (Master Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-5 h-5 text-red-600" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu admin..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-stone-900 placeholder-stone-400 text-sm outline-none focus:border-red-500 font-medium"
                />
              </div>
              <span className="text-[11px] text-stone-500 mt-1 block">
                (Mặc định là <code>admin123</code>, có thể đổi trong file <code>.env.local</code>)
              </span>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-red-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-lg transition active:scale-98">
              Đăng Nhập Quản Trị
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-stone-500 hover:text-red-700 font-medium transition">
              ← Quay lại trang người dùng
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <main className="min-h-screen bg-stone-100 text-stone-900 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Navbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-300">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-stone-500 hover:text-red-700 transition">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <img src="/assets/logo.png" alt="GLOBAL SAFE" className="h-8 max-w-[140px] object-contain" />
              <h1 className="text-2xl sm:text-3xl font-black text-red-800 flex items-center gap-2">
                <span>Bảng Quản Trị Secret Santa 🎅</span>
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">Quản lý danh sách thành viên, chạy thuật toán ghép cặp và theo dõi tiến độ</p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isMongo ? "bg-emerald-100 border border-emerald-300 text-emerald-800" : "bg-blue-100 border border-blue-300 text-blue-800"}`}>
              <Database className="w-3.5 h-3.5" />
              {isMongo ? "MongoDB Connected" : "Local Storage Mode"}
            </span>

            <button
              onClick={async () => {
                sessionStorage.removeItem("admin_token");
                tokenRef.current = "";
                setToken("");
                setIsAuthenticated(false);
                await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" }).catch(() => {});
              }}
              className="text-xs py-1.5 px-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl font-bold transition cursor-pointer"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* Toast / Notification Banner */}
        {message && (
          <div className={`p-4 rounded-2xl flex items-center justify-between border ${message.type === "success" ? "bg-emerald-950/80 border-emerald-500 text-emerald-200" : "bg-red-950/80 border-red-500 text-red-200"}`}>
            <div className="flex items-center gap-2 text-sm font-semibold">
              {message.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-xs underline hover:opacity-80">
              Đóng
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-bold block mb-1">Tổng Thành Viên</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-stone-900">{stats.totalUsers || 0}</span>
              <Users className="w-6 h-6 text-red-600" />
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-bold block mb-1">Trạng Thái Ghép Cặp</span>
            <div className="flex items-center justify-between">
              <span className={`text-xl font-bold ${stats.totalMatched > 0 ? "text-emerald-700" : "text-amber-600"}`}>{stats.totalMatched > 0 ? `Đã Ghép (${stats.totalMatched})` : "Chưa Ghép"}</span>
              <Shuffle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-bold block mb-1">Đã Mở Xem Thẻ Quà</span>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-700">
                {stats.viewedCount || 0} / {stats.totalUsers || 0}
              </span>
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-sm">
            <span className="text-xs text-stone-500 uppercase tracking-wider font-bold block mb-1">Phòng Ban Tham Gia</span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-red-700">{Array.from(new Set(users.map((u) => u.department))).length} Phòng</span>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-4">
          <h2 className="text-base font-bold text-red-800 uppercase tracking-wider">Thao Tác Điều Hành</h2>

          <div className="flex flex-wrap gap-3">
            {/* Run Match */}
            <button
              onClick={handleRunMatch}
              disabled={isLoading || users.length < 2}
              className="py-3 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-2xl transition flex items-center gap-2 shadow-md shadow-red-600/20 active:scale-95 disabled:opacity-50"
            >
              <Shuffle className="w-4 h-4" />
              <span>Chạy Thuật Toán Ghép Cặp (Auto Match)</span>
            </button>

            {/* Seed Demo Data */}
            <button onClick={handleSeedMock} disabled={isLoading} className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-2xl transition flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              <span>Nạp Data Demo Mẫu (6 người)</span>
            </button>

            {/* Reset Match */}
            {matches.length > 0 && (
              <button onClick={handleResetMatch} disabled={isLoading} className="py-3 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 font-semibold rounded-2xl transition flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Hủy Kết Quả Ghép Cặp</span>
              </button>
            )}

            {/* Export Excel */}
            <button onClick={handleExportExcel} disabled={users.length === 0} className="py-3 px-4 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-semibold rounded-2xl transition flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Xuất File Excel Kết Quả</span>
            </button>

            {/* Download Template */}
            <button onClick={handleDownloadTemplate} className="py-3 px-4 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-semibold rounded-2xl transition flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              <span>Tải File Mẫu Excel</span>
            </button>

            {/* Hidden file input for Import */}
            <input type="file" ref={fileInputRef} accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />

            {/* Import Button */}
            <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-2xl transition flex items-center gap-2 shadow-sm">
              <Upload className="w-4 h-4" />
              <span>Import File Excel / CSV</span>
            </button>

            {/* Clear All Data */}
            <button onClick={handleClearAll} disabled={isLoading || users.length === 0} className="py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 font-semibold rounded-2xl transition flex items-center gap-2 ml-auto">
              <Trash2 className="w-4 h-4" />
              <span>Xóa Hết Dữ Liệu</span>
            </button>
          </div>
        </div>

        {/* Master Table of Members */}
        <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>Danh Sách Thành Viên & Cặp Secret Santa ({users.length})</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">Chỉ có Ban Tổ Chức mới xem được sơ đồ ghép cặp này</p>
            </div>
            <button onClick={() => fetchDashboard()} className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition" title="Làm mới">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {users.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-base font-semibold text-stone-600">Chưa có thành viên nào trong danh sách!</p>
              <p className="text-xs mt-1">
                Bấm <strong>&quot;Nạp Data Demo Mẫu&quot;</strong> hoặc <strong>&quot;Import File Excel&quot;</strong> để bắt đầu.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3.5 px-4">STT</th>
                    <th className="py-3.5 px-4">Thành Viên</th>
                    <th className="py-3.5 px-4">4 Số Cuối ĐT</th>
                    <th className="py-3.5 px-4">Phòng Ban</th>
                    <th className="py-3.5 px-4">Trạng Thái Xem</th>
                    <th className="py-3.5 px-4">Sẽ Tặng Quà Cho</th>
                    <th className="py-3.5 px-4">Santa Của Người Này</th>
                    <th className="py-3.5 px-4">3 Gợi Ý Hint Đã Khóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {users.map((u, idx) => {
                    const matchAsSanta = matches.find((m) => m.santaEmail.toLowerCase().trim() === u.email.toLowerCase().trim());
                    const matchAsRecipient = matches.find((m) => m.recipientEmail.toLowerCase().trim() === u.email.toLowerCase().trim());

                    return (
                      <tr key={u.id} className="hover:bg-stone-50 transition">
                        <td className="py-3 px-4 font-mono text-stone-500">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-stone-200 shrink-0">
                              {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-xs text-stone-600 bg-red-100">{u.name.charAt(0)}</div>}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900">{u.name}</div>
                              <div className="text-stone-500 text-xs">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-red-600 font-bold">{u.phoneLast4}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-800">{u.department}</span>
                        </td>
                        <td className="py-3 px-4">
                          {u.hasViewed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở xem
                            </span>
                          ) : (
                            <span className="text-stone-400 text-xs font-medium">Chưa mở</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {matchAsSanta ? (
                            <div>
                              <div className="font-bold text-red-700">{matchAsSanta.recipientName}</div>
                              <div className="text-xs text-stone-500">Phòng {matchAsSanta.recipientDepartment}</div>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-xs">Chưa ghép</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {matchAsRecipient ? (
                            <div>
                              <div className="font-bold text-emerald-700">{matchAsRecipient.santaName}</div>
                              <div className="text-xs text-stone-500">Phòng {matchAsRecipient.santaDepartment}</div>
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-xs">Chưa ghép</span>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          {matchAsRecipient && matchAsRecipient.hints.length > 0 ? (
                            <ul className="text-[11px] text-stone-700 list-disc list-inside space-y-0.5">
                              {matchAsRecipient.hints.map((h, hIdx) => (
                                <li key={hIdx} className="truncate" title={h}>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-stone-400 italic text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Settings Box */}
        <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm space-y-6">
          <h2 className="text-base font-bold text-red-800 uppercase tracking-wider">Cài Đặt Thể Lệ & Mốc Thời Gian</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Nội Dung Thể Lệ / Luật Chơi (Hỗ trợ Markdown)</label>
              <textarea rows={8} value={rulesDraft} onChange={(e) => setRulesDraft(e.target.value)} className="w-full p-4 bg-stone-50 border border-stone-300 rounded-2xl text-xs text-stone-800 outline-none focus:border-red-500 font-mono shadow-inner" />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Tên Công Ty (Hiển thị góc trái thanh Menu)</label>
                <input type="text" placeholder="Tên công ty..." value={companyNameDraft} onChange={(e) => setCompanyNameDraft(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-red-500 font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">Link Ảnh Logo Công Ty (Để trống sẽ dùng Badge mặc định)</label>
                <input type="text" placeholder="https://... hoặc /logo.png" value={companyLogoDraft} onChange={(e) => setCompanyLogoDraft(e.target.value)} className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-red-500 font-medium" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Ngày Mở Cổng Bóc Quà (Countdown 1)
                  </label>
                  <input
                    type="datetime-local"
                    value={revealDateDraft}
                    onChange={(e) => setRevealDateDraft(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-red-500 font-medium"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Đồng hồ đếm ngược tới giờ bắt đầu bóc Santa
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Ngày Diễn Ra Đêm Tiệc (Countdown 2)
                  </label>
                  <input
                    type="datetime-local"
                    value={eventDateDraft}
                    onChange={(e) => setEventDateDraft(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 outline-none focus:border-emerald-600 font-medium"
                  />
                  <span className="text-[11px] text-stone-500 mt-1 block">
                    Qua ngày mở cổng, đồng hồ tự đếm tiếp đến Đêm Tiệc
                  </span>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-stone-700 space-y-2">
                <div className="font-bold text-red-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Ghi nhớ lịch trình của team:
                </div>
                <div>
                  • <strong>24/11 - 25/11:</strong> Linh, Bảo, Nhi thu thập dữ liệu profile và 10 câu hỏi.
                </div>
                <div>
                  • <strong>26/11:</strong> Import file Excel vào Admin và bấm Chạy thuật toán ghép cặp.
                </div>
                <div>
                  • <strong>27/11:</strong> Mở link web cho toàn công ty vào bóc thẻ Santa!
                </div>
              </div>

              <button onClick={handleSaveSettings} disabled={isLoading} className="py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition flex items-center gap-2 shadow-sm">
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi Cài Đặt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
