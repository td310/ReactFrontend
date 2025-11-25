import ProfileLayout from '@/components/UserProfile/ProfileLayout';
import ProfileOverview from '@/components/UserProfile/ProfileOverview';

const UserProfile: React.FC = () => {
  return (
    <ProfileLayout>
      <ProfileOverview />
    </ProfileLayout>
  );
};

export default UserProfile;