export default function AuthError({ message }: { message: string }) {
    return (
        <div
            role="alert"
            className="mb-5 rounded-[10px] border border-[#FECACA] bg-[#FEF2F2] px-3.5 py-3 text-sm text-[#B91C1C]"
        >
            {message}
        </div>
    );
}
