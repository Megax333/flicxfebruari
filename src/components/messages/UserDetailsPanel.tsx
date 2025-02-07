import { X, User2, Bell, Ban, Flag } from 'lucide-react';

interface UserDetailsPanelProps {
  contact: {
    id: string;
    username: string;
    avatar_url: string;
    bio?: string;
    status?: string;
  };
}

const UserDetailsPanel = ({ contact }: UserDetailsPanelProps) => {
  return (
    <div className="w-80 border-l border-[#1E1E2A] flex flex-col min-h-0">
      <div className="p-4 border-b border-[#1E1E2A] flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Info</h3>
        <button className="p-2 hover:bg-[#1E1E2A] rounded-lg">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto">
        <div className="p-4 flex flex-col items-center">
          <img
            src={contact.avatar_url || "/default-avatar.png"}
            alt={contact.username}
            className="w-20 h-20 rounded-full mb-4"
          />
          <h2 className="text-xl font-semibold mb-1">{contact.username}</h2>
          <span className="text-sm text-gray-400 mb-4">{contact.status || 'Active now'}</span>
          
          {contact.bio && (
            <div className="w-full bg-[#1E1E2A] rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300">{contact.bio}</p>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1E1E2A] transition-colors">
              <User2 size={20} />
              <span>View Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1E1E2A] transition-colors">
              <Bell size={20} />
              <span>Mute Notifications</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1E1E2A] transition-colors text-red-500">
              <Ban size={20} />
              <span>Block User</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#1E1E2A] transition-colors text-red-500">
              <Flag size={20} />
              <span>Report User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;