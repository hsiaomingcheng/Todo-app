import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileModal from "@/components/common/EditProfileModal";
import ChangePasswordModal from "@/components/common/ChangePasswordModal";
import { updateProfile, updatePassword } from "@/api/apis";

export default function ProfilePage() {
    const { user, updateUser } = useAuth();

    const handleUpdateProfile = async (id: number, email: string, first_name: string, last_name: string) => {
        await updateProfile(id, email, first_name, last_name);
        updateUser({ ...user!, email, first_name, last_name });
    };

    const getUserInitials = () => {
        const first = user?.first_name?.[0] || "";
        const last = user?.last_name?.[0] || "";
        return `${first}${last}`.toUpperCase();
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-[#14161A]">Profile</h1>
                <p className="mt-1.5 text-[15px] text-[#5B6270]">Your personal account details</p>
            </div>

            {/* Avatar + name section */}
            <div className="bg-white rounded-[14px] border border-[#E6E8EC] p-6 mb-4">
                <div className="flex items-center gap-5">
                    <Avatar className="h-16 w-16">
                        {/* TODO: Upload avatar — allow user to upload a profile picture (calls PATCH /api/user/avatar) */}
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-[#0F766E] text-white text-xl font-semibold">
                            {getUserInitials()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="text-lg font-semibold tracking-[-0.01em] text-[#14161A]">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="font-[Geist_Mono_Variable,ui-monospace,monospace] text-[13px] text-[#5B6270]">@{user?.user_account}</p>
                    </div>
                </div>
            </div>

            {/* Info fields */}
            <div className="bg-white rounded-[14px] border border-[#E6E8EC] divide-y divide-[#ECEEF1]">
                <ProfileField label="First name" value={user?.first_name} />
                <ProfileField label="Last name" value={user?.last_name} />
                <ProfileField label="Username" value={`@${user?.user_account}`} />
                <ProfileField label="Email" value={user?.email} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                {/* TODO: Edit profile button — open a form/modal to update first_name, last_name, email (calls PATCH /api/user/profile) */}
                {user &&
                    <EditProfileModal
                        user={user}
                        submitFunc={handleUpdateProfile}
                    />
                }

                {/* TODO: Change password section — separate form for current password + new password (calls PATCH /api/user/password) */}
                {user &&
                    <ChangePasswordModal
                        submitFunc={updatePassword}
                    />
                }
            </div>
        </div>
    );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-[#5B6270] w-32 flex-shrink-0">{label}</span>
            <span className="text-sm text-[#14161A] font-medium break-all text-right">{value || "—"}</span>
        </div>
    );
}
