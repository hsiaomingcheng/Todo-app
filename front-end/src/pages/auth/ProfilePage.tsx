import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"
import EditProfileModal from "@/components/common/EditProfileModal";
import { updateProfile } from "@/api/apis";

export default function ProfilePage() {
    const { user } = useAuth();

    const getUserInitials = () => {
        const first = user?.first_name?.[0] || "";
        const last = user?.last_name?.[0] || "";
        return `${first}${last}`.toUpperCase();
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-app-text">Profile</h1>
                <p className="text-sm text-app-text-subtle mt-0.5">Your personal account details</p>
            </div>

            {/* Avatar + name section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-4">
                <div className="flex items-center gap-5">
                    <Avatar className="h-16 w-16">
                        {/* TODO: Upload avatar — allow user to upload a profile picture (calls PATCH /api/user/avatar) */}
                        <AvatarImage src={user?.avatar_url} />
                        <AvatarFallback className="bg-app-primary text-white text-xl font-semibold">
                            {getUserInitials()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="text-lg font-semibold text-app-text">
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="text-sm text-app-text-subtle">@{user?.user_account}</p>
                    </div>
                </div>
            </div>

            {/* Info fields */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                <ProfileField label="First name" value={user?.first_name} />
                <ProfileField label="Last name" value={user?.last_name} />
                <ProfileField label="Username" value={`@${user?.user_account}`} />
                <ProfileField label="Email" value={user?.email} />
            </div>

            {/* TODO: Edit profile button — open a form/modal to update first_name, last_name, email (calls PATCH /api/user/profile) */}
            {user &&
                <EditProfileModal
                    user={user}
                    submitFunc={updateProfile}
                />
            }


            {/* TODO: Change password section — separate form for current password + new password (calls PATCH /api/user/password) */}
            <Button>Change Password</Button>
        </div>
    );
}

function ProfileField({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex items-center justify-between px-5 py-4">
            <span className="text-sm text-app-text-subtle w-32 flex-shrink-0">{label}</span>
            <span className="text-sm text-app-text font-medium">{value || "—"}</span>
        </div>
    );
}
