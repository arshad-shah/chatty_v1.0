import Image from "next/image";
import CircularProgress from '@mui/material/CircularProgress'


function LoadingComponent() {
  return (
    <center
      style={{
        display: "grid",
        placeItems: "center",
        height: "100vh",
      }}
    >
      <div>
        <Image
          src="/logo.svg"
          alt=""
          height={200}
          width={200}
          className={{ marginBottom: 10 }}
        />
        <CircularProgress
				color="secondary"
				size={100}
				thickness={5}
			/>
      </div>
    </center>
  );
}

export default LoadingComponent;
