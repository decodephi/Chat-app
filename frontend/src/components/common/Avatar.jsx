import { getInitials } from "../../utils/helpers";

const Avatar = ({ user, size = "md", showStatus = false, isOnline = false }) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  return (
    <div className="relative flex-shrink-0">
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt={user.name}
          className={`${sizes[size]} rounded-full object-cover bg-chat-surface border border-chat-border`}
          onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
        />
      ) : null}
      {/* Fallback initials */}
      <div
        className={`${sizes[size]} rounded-full bg-primary-600 flex items-center justify-center font-semibold text-white ${user?.profilePic ? "hidden" : "flex"}`}
      >
        {getInitials(user?.name)}
      </div>

      {showStatus && (
        <span className={isOnline ? "status-online" : "status-offline"} />
      )}
    </div>
  );
};

export default Avatar;
