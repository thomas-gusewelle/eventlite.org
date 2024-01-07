import Lottie, { LottieRef, LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

 const LottiePlayer = ({
  animationData,
  loop,
  divClasses,
}: {
  animationData: unknown;
  loop?: number;
  divClasses?: string;
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const { ref, inView } = useInView({ threshold: 0.25 });

  useEffect(() => {
    if (inView) {
      lottieRef.current?.stop();
      lottieRef.current?.play();
    } else {
      lottieRef.current?.goToAndStop(0, true);
    }
  }, [inView]);

  return (
    <div ref={ref} className={divClasses}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoPlay={false}
        lottieRef={lottieRef}
      />
    </div>
  );
};
 export default LottiePlayer;
