interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex flex-col min-h-screen w-full">{children}</div>
    </div>
  );
};

export default ProfileLayout;

