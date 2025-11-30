import { useParams } from "react-router-dom";
import ImageHeader from "../components/ImageHeader";
import NewUserForm from "../components/NewUserForm";
import ProfileForm from "../components/ProfileForm";

const UserPage = () => {
  const { profile } = useParams();

  return (
    <div className="grid place-items-center h-full min-h-screen">
      <div>
        <ImageHeader />

        <main className="w-full max-w-md mt-1.5">
          {!profile ? <NewUserForm /> : <ProfileForm />}
        </main>
      </div>
    </div>
  );
};

export default UserPage;
