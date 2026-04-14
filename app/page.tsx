'use client';

import CanvasLoader from "./components/common/CanvasLoader";
import ScrollWrapper from "./components/common/ScrollWrapper";
import ViewAllProjectsOverlay from "./components/common/ViewAllProjectsOverlay";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
  return (
    <>
      <CanvasLoader>
        <ScrollWrapper>
          <Hero/>
          <Experience/>
          <Footer/>
        </ScrollWrapper>
      </CanvasLoader>
      <ViewAllProjectsOverlay />
    </>
  );
};
export default Home;
