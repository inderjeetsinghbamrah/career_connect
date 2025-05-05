import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        <h2 className="text-2xl font-bold text-gray-200">
          Join the community of job seekers and recruiters
        </h2>
        <p className="text-gray-400 mt-4">
          Explore thousands of job listings or find the perfect candidate
              </p>
              <p className="text-gray-400 mt-4">
                  Whether you're looking for a new opportunity or seeking top talent, we've got you covered.
                </p>
      </div>
    </div>
  );
};

export default AppLayout;
