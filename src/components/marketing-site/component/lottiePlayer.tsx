import Lottie, { LottieRef, LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export const LottiePlayer = ({
  animationData,
  loop,
}: {
  animationData: unknown;
  loop?: number;
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
    <div ref={ref}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoPlay={false}
        lottieRef={lottieRef}
      />
    </div>
  );
};
