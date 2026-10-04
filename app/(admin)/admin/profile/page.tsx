"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  useAdminToast,
} from "@/components/admin/ui";

export default function AdminProfilePage() {
  const router = useRouter();
  const { toast, showSuccess, showError } = useAdminToast();
  const [loading, setLoading] = useState(false);

  const [currentUsername, setCurrentUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernamePassword, setUsernamePassword] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.username) {
          setCurrentUsername(data.username);
          setNewUsername(data.username);
        }
      })
      .catch(() => undefined);
  }, []);

  async function saveUsername() {
    setSavingUsername(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "username",
          username: newUsername,
          currentPassword: usernamePassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setCurrentUsername(data.username);
      setNewUsername(data.username);
      setUsernamePassword("");
      showSuccess("نام کاربری عوض شد");
      router.refresh();
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    } finally {
      setSavingUsername(false);
    }
  }

  async function savePassword() {
    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "password",
          currentPassword: passwordCurrent,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setPasswordCurrent("");
      setNewPassword("");
      setConfirmPassword("");
      showSuccess("رمز عبور عوض شد");
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    } finally {
      setSavingPassword(false);
    }
  }

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    showSuccess("خارج شدید");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="پروفایل"
        description="نام کاربری و رمز را جداگانه عوض کنید."
      />

      <div className="grid max-w-5xl gap-4 lg:grid-cols-2">
        <AdminCard className="space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-navy-950">
              تغییر نام کاربری
            </h2>
            <p className="mt-1 text-xs text-navy-500">
              الان: <span dir="ltr">{currentUsername || "…"}</span>
            </p>
          </div>
          <AdminInput
            label="نام کاربری جدید"
            value={newUsername}
            dir="ltr"
            autoComplete="username"
            onChange={(e) => setNewUsername(e.target.value)}
            hint="حداقل ۳ حرف انگلیسی، عدد یا . _ -"
          />
          <AdminInput
            label="رمز فعلی (تأیید)"
            type="password"
            value={usernamePassword}
            dir="ltr"
            autoComplete="current-password"
            onChange={(e) => setUsernamePassword(e.target.value)}
          />
          <AdminButton
            onClick={saveUsername}
            disabled={
              savingUsername ||
              !usernamePassword ||
              !newUsername.trim() ||
              newUsername.trim() === currentUsername
            }
          >
            {savingUsername ? "در حال ذخیره…" : "ذخیره نام کاربری"}
          </AdminButton>
        </AdminCard>

        <AdminCard className="space-y-4">
          <h2 className="text-base font-extrabold text-navy-950">تغییر رمز عبور</h2>
          <AdminInput
            label="رمز فعلی"
            type="password"
            value={passwordCurrent}
            dir="ltr"
            autoComplete="current-password"
            onChange={(e) => setPasswordCurrent(e.target.value)}
          />
          <AdminInput
            label="رمز جدید"
            type="password"
            value={newPassword}
            dir="ltr"
            autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
            hint="حداقل ۸ کاراکتر"
          />
          <AdminInput
            label="تکرار رمز جدید"
            type="password"
            value={confirmPassword}
            dir="ltr"
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <AdminButton
            onClick={savePassword}
            disabled={
              savingPassword ||
              !passwordCurrent ||
              !newPassword ||
              !confirmPassword
            }
          >
            {savingPassword ? "در حال ذخیره…" : "ذخیره رمز جدید"}
          </AdminButton>
        </AdminCard>
      </div>

      <AdminCard className="mt-4 max-w-5xl space-y-3">
        <h2 className="text-base font-extrabold text-navy-950">خروج</h2>
        <AdminButton variant="danger" onClick={logout} disabled={loading}>
          {loading ? "خروج…" : "خروج از حساب"}
        </AdminButton>
      </AdminCard>
    </div>
  );
}
