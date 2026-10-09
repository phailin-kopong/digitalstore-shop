"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function thaiError(m: string) {
  if (m.includes("Invalid login credentials")) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  if (m.includes("already registered")) return "อีเมลนี้สมัครสมาชิกแล้ว";
  if (m.includes("at least 6")) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  if (m.includes("Email not confirmed")) return "ยังไม่ได้ยืนยันอีเมล กรุณาตรวจกล่องจดหมาย";
  return m;
}

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ t: "err" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) {
      setMsg({ t: "err", text: thaiError(error.message) });
      return;
    }
    if (mode === "signup" && !data.session) {
      setMsg({ t: "ok", text: "สมัครสำเร็จ! กรุณาตรวจอีเมลเพื่อยืนยันก่อนเข้าสู่ระบบ" });
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="page">
      <div className="authbox card">
        <h2 style={{ marginBottom: 4 }}>{mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}</h2>
        <p className="mute" style={{ margin: 0 }}>
          {mode === "login" ? "ยินดีต้อนรับกลับมา 🌸" : "สร้างบัญชีเพื่อเริ่มช้อปผลงานศิลปินไทย"}
        </p>
        <form onSubmit={submit}>
          <label>อีเมล</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label>รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn" type="submit" disabled={busy} style={{ width: "100%", marginTop: 20 }}>
            {busy ? "กำลังดำเนินการ…" : mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </button>
        </form>
        {msg && <div className={`msg ${msg.t}`}>{msg.text}</div>}
        <div className="swap">
          {mode === "login" ? "ยังไม่มีบัญชี? " : "มีบัญชีอยู่แล้ว? "}
          <button className="linkbtn" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setMsg(null); }}>
            {mode === "login" ? "สมัครสมาชิก" : "เข้าสู่ระบบ"}
          </button>
        </div>
      </div>
    </div>
  );
}
