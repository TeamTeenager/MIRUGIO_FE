import splashVideo from '../../assets/splash.mp4'

interface Props {
  onDone: () => void
}

export default function Splash({ onDone }: Props) {
  return (
    <div className="h-full flex items-center justify-center bg-black overflow-hidden">
      <video
        src={splashVideo}
        autoPlay
        muted
        playsInline
        onEnded={onDone}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
