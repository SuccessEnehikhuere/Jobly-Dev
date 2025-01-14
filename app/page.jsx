import Image from 'next/image'
import Logo from '@/assets/logo.svg'
import LandingImage from '@/assets/main.svg'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6 ">
        <Image src={Logo} alt="Logo" />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
        <div>
          <h1 className="capitalize text-4xl md:text-7xl font-bold">
            job <span className="text-primary">tracking</span> app
          </h1>
          <p className="leading-loose max-w-md mt-4 ">
            Jobly is where talent meets opportunity. We&apos;re dedicated to
            helping job seekers find their dream roles and employers discover
            exceptional candidates. Whether you&apos;re building your career or
            your team, Jobly is here to help you succeed. Your journey starts
            with us!
          </p>
          <Button asChild className="mt-4">
            <Link href="/add-job">Get Started</Link>
          </Button>
        </div>
        <Image
          src={LandingImage}
          alt="Landing image"
          className="hidden lg:block "
        />
      </section>
    </main>
  )
}
