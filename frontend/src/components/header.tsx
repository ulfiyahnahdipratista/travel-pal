import AnimatedGradientBackground from './animated-gradient';
import SplitText from './ui/TextAnimations/SplitText/SplitText'

type HeaderProps = {
  text: string;
  deskripsi: string;
}

const Header = (payload: HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen">
      <AnimatedGradientBackground>
        {/* Konten SplitText tetap di dalam AnimatedGradientBackground */}
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <SplitText
            text={payload.text}
            splitType='chars'
            className='text-4xl md:text-9xl font-bold text-center mb-4'
            delay={100}
            duration={0.6}
            ease={"power3.out"}
          />

          <SplitText
            text={payload.deskripsi}
            splitType='chars'
            className='text-xl font-normal text-center mb-4'
            delay={100}
            duration={0.6}
            ease={"power3.out"}
          />
        </div>
      </AnimatedGradientBackground>
    </div>
  )
}

export default Header