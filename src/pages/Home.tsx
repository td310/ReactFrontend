import HomeLayout from '@/components/Home/HomeLayout';
import HomeOverview from '@/components/Home/HomeOverview';

const Home: React.FC = () => {
  return (
    <HomeLayout>
      <HomeOverview />
    </HomeLayout>
  );
};

export default Home;