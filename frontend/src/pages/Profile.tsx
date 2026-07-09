import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { uploadImage } from "../utils/uploadImage";
import PostCard from "../features/post/PostCard";

export default function Profile() {
  const { id } = useParams();

  const localUser = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const isMine = Number(id) === Number(localUser?.id);

  const loadProfile = async () => {
    const res = await api.get(`/users/${id}`);
    setProfile(res.data);
    setName(res.data.name || "");
    setBio(res.data.bio || "");
    setAvatar(res.data.avatar || "");
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleAvatar = async (file?: File) => {
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setAvatar(url);
    } catch (err) {
      console.error("Upload avatar gagal:", err);
      alert("Gagal upload foto profil. Coba lagi.");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await api.put("/users/me", {
        name,
        bio,
        avatar,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      setEditing(false);
      await loadProfile();
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const res = await api.post(`/follow/${id}`);

    setProfile((prev: any) => ({
      ...prev,
      isFollowing: res.data.following,
      _count: {
        ...prev._count,
        followers: prev._count.followers + (res.data.following ? 1 : -1),
      },
    }));
  };

  if (!profile) {
    return <div className="p-6 text-slate-400">Loading profile...</div>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            src={avatar || `https://ui-avatars.com/api/?name=${profile.name}`}
            className="h-24 w-24 rounded-full border border-slate-700 object-cover"
          />

          <div className="flex-1">
            {!editing ? (
              <>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-sm text-slate-400">{profile.email}</p>
                <p className="mt-2 text-slate-300">
                  {profile.bio || "Belum ada bio."}
                </p>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 outline-none focus:border-cyan-400"
                />

                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 outline-none focus:border-cyan-400"
                />

                <label className="inline-block cursor-pointer rounded-xl border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
                  Edit Photo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleAvatar(e.target.files?.[0])}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {isMine ? (
              editing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditing(false)}
                    className="rounded-xl border border-slate-700 px-4 py-2"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950"
                >
                  Edit Profile
                </button>
              )
            ) : (
              <button
                onClick={handleFollow}
                className={`rounded-xl px-4 py-2 font-bold ${
                  profile.isFollowing
                    ? "border border-slate-700 text-slate-300"
                    : "bg-cyan-500 text-slate-950"
                }`}
              >
                {profile.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-center">
          <div>
            <p className="font-bold">{profile._count?.posts || 0}</p>
            <p className="text-xs text-slate-500">Posts</p>
          </div>

          <div>
            <p className="font-bold">{profile._count?.followers || 0}</p>
            <p className="text-xs text-slate-500">Followers</p>
          </div>

          <div>
            <p className="font-bold">{profile._count?.following || 0}</p>
            <p className="text-xs text-slate-500">Following</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {profile.posts?.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
            Belum ada post.
          </div>
        ) : (
          profile.posts?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      <Link
        to="/dashboard"
        className="mt-6 inline-block text-sm text-cyan-400 hover:underline"
      >
        ← Back to dashboard
      </Link>
    </main>
  );
}