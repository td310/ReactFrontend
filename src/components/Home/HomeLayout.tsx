interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-amber-50">
      <div className="flex flex-col min-h-screen w-full">
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;

