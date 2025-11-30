import ClipLoader from "react-spinners/ClipLoader";

const override = {
  display: "block",
};

const Spinner = ({ loading }) => {
  return (
    <div className="grid place-items-center absolute w-full h-screen top-0 left-0">
      <ClipLoader
        color="#EF6C57"
        loading={loading}
        cssOverride={override}
        size={150}
      />
    </div>
  );
};
export default Spinner;
