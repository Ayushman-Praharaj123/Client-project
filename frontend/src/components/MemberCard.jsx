import { MapPin, Briefcase } from "lucide-react";

const MemberCard = ({ member }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-w-[280px] mx-2 hover:shadow-lg transition">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-2xl font-bold">
          {member.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{member.fullName}</h3>
          <div className="flex items-center space-x-1 text-gray-600 text-sm mt-1">
            <Briefcase size={14} />
            <span>{member.workerType}</span>
          </div>
          {member.location && (
            <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
              <MapPin size={14} />
              <span>{member.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberCard;

