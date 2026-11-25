import { IUser, IMatch } from "./types";

export interface MatchingResult {
  success: boolean;
  matches: IMatch[];
  warnings?: string[];
  sameDepartmentCount: number;
}

/**
 * Pick 3 random distinct hints from a user's answers
 */
function pick3RandomHints(user: IUser): string[] {
  const validAnswers = (user.questions || []).filter(
    (q) => q.answer && q.answer.trim().length > 0
  );

  if (validAnswers.length === 0) {
    return [
      `Sở thích: Thích những điều bất ngờ`,
      `Đặc điểm: Rất hào phóng và dễ thương`,
      `Lời nhắn: Chúc bạn một mùa Giáng sinh an lành! 🎄`
    ];
  }

  // Shuffle valid answers
  const shuffled = [...validAnswers].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(3, shuffled.length));

  return selected.map((q) => `${q.question}: ${q.answer}`);
}

/**
 * Robust Secret Santa matching algorithm
 * Guarantees:
 * - Nobody gifts themselves
 * - Everyone gives exactly 1 gift and receives exactly 1 gift
 * - Priority: No same-department gifts
 */
export function generateMatches(users: IUser[]): MatchingResult {
  if (!users || users.length < 2) {
    return {
      success: false,
      matches: [],
      warnings: ["Cần ít nhất 2 người tham gia để tiến hành ghép cặp Secret Santa."],
      sameDepartmentCount: 0,
    };
  }

  const n = users.length;
  const santas = [...users];

  // Try finding a 100% valid derangement without same department
  const MAX_ATTEMPTS = 1500;
  let bestRecipients: IUser[] | null = null;
  let minSameDeptViolation = Infinity;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const recipients = [...users].sort(() => Math.random() - 0.5);
    let valid = true;
    let sameDeptCount = 0;

    for (let i = 0; i < n; i++) {
      if (santas[i].id === recipients[i].id) {
        valid = false;
        break;
      }
      if (
        santas[i].department &&
        recipients[i].department &&
        santas[i].department.toLowerCase().trim() === recipients[i].department.toLowerCase().trim()
      ) {
        sameDeptCount++;
      }
    }

    if (valid) {
      if (sameDeptCount === 0) {
        // Perfect match!
        bestRecipients = recipients;
        minSameDeptViolation = 0;
        break;
      }

      if (sameDeptCount < minSameDeptViolation) {
        minSameDeptViolation = sameDeptCount;
        bestRecipients = recipients;
      }
    }
  }

  // Fallback: If random shuffling didn't find a 0-violation cycle, try derangement rotation
  if (!bestRecipients || minSameDeptViolation > 0) {
    // Sort by department to distribute
    const sortedByDept = [...users].sort((a, b) =>
      a.department.localeCompare(b.department)
    );
    // Shift by half or smart offset
    for (let offset = 1; offset < n; offset++) {
      const candidate: IUser[] = [];
      let valid = true;
      let sameDept = 0;

      for (let i = 0; i < n; i++) {
        const r = sortedByDept[(i + offset) % n];
        if (sortedByDept[i].id === r.id) {
          valid = false;
          break;
        }
        if (
          sortedByDept[i].department.toLowerCase().trim() ===
          r.department.toLowerCase().trim()
        ) {
          sameDept++;
        }
        candidate.push(r);
      }

      if (valid && sameDept < minSameDeptViolation) {
        minSameDeptViolation = sameDept;
        // Re-align with original santas order
        const map = new Map<string, IUser>();
        for (let i = 0; i < n; i++) {
          map.set(sortedByDept[i].id, candidate[i]);
        }
        bestRecipients = santas.map((s) => map.get(s.id)!);
        if (sameDept === 0) break;
      }
    }
  }

  if (!bestRecipients) {
    return {
      success: false,
      matches: [],
      warnings: ["Không thể tạo chu trình tặng quà hợp lệ. Vui lòng kiểm tra lại danh sách."],
      sameDepartmentCount: 0,
    };
  }

  // Construct Matches
  const matches: IMatch[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < n; i++) {
    const santa = santas[i];
    const recipient = bestRecipients[i];
    const hints = pick3RandomHints(santa);

    matches.push({
      id: `m_${santa.id}_${recipient.id}`,
      santaId: santa.id,
      santaName: santa.name,
      santaEmail: santa.email,
      santaDepartment: santa.department,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      recipientDepartment: recipient.department,
      hints,
      matchedAt: now,
    });
  }

  const warnings: string[] = [];
  if (minSameDeptViolation > 0) {
    warnings.push(
      `Lưu ý: Có ${minSameDeptViolation} cặp cùng bộ phận do phân bổ nhân sự phòng ban chênh lệch lớn.`
    );
  }

  return {
    success: true,
    matches,
    warnings: warnings.length > 0 ? warnings : undefined,
    sameDepartmentCount: minSameDeptViolation,
  };
}
