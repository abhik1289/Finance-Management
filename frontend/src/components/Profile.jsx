import { CalendarDays, LogOut, Mail, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/authApi";
import Button from "../components/common/Button";

function getStoredUser() {
  const raw = localStorage.getItem("authUser");

  if (!raw) {
    return { fullName: "", email: "" };
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { fullName: "", email: "" };
  }
}

function getNameFromEmail(email) {
  if (!email) {
    return "User";
  }

  const localPart = email.split("@")[0] ?? "User";
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    joinedOn: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();

    async function loadProfile() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getProfile();
        const resolvedEmail = data?.email ?? storedUser.email ?? "";
        const resolvedName =
          data?.fullName || storedUser.fullName || getNameFromEmail(resolvedEmail);

        setProfile((prev) => ({
          ...prev,
          name: resolvedName,
          email: resolvedEmail,
          joinedOn: data?.joinedOn ?? null,
        }));
      } catch {
        setError("Unable to load profile. Please sign in again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const joinedDateLabel = useMemo(() => {
    if (!profile.joinedOn) {
      return "-";
    }

    const parsedDate = new Date(profile.joinedOn);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  }, [profile.joinedOn]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    navigate("/sign-in");
  };

  if (isLoading) {
    return <section className="mx-auto w-full max-w-4xl">Loading profile...</section>;
  }

  if (error) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-4">
        <p className="text-red-600">{error}</p>
        <Button type="button" onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
          Go to Sign In
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-slate-100 border-slate-300 bg-white shadow-xl shadow-slate-100/50">
        <div className="p-6 md:p-8">
          <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
              <User size={24} />
            </div>
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Welcome back
              </p>
              <p className="m-0 text-xl font-bold text-gray-900">{profile.name || "User"}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <User size={16} />
                <p className="m-0 text-xs font-semibold uppercase tracking-wide">Name</p>
              </div>
              <p className="m-0 text-base font-semibold text-gray-900">{profile.name || "User"}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <Mail size={16} />
                <p className="m-0 text-xs font-semibold uppercase tracking-wide">Email</p>
              </div>
              <p className="m-0 break-all text-base font-semibold text-gray-900">{profile.email || "-"}</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <CalendarDays size={16} />
                <p className="m-0 text-xs font-semibold uppercase tracking-wide">Join Date</p>
              </div>
              <p className="m-0 text-base font-semibold text-gray-900">{joinedDateLabel}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <Button
              type="button"
              onClick={handleLogout}
              className="h-11 gap-2 rounded-xl bg-red-600 px-5 text-white shadow-md shadow-red-200 transition hover:bg-red-700"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
