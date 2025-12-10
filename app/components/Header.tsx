import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <div>
        <div className='bg-primary h-3 w-screen'></div>
        
        <header className='py-8 flex justify-between w-[90vw] md:max-w-[80vw] mx-auto  '>
          <div className=''>
            <Image 
              unoptimized src={'/alumni_logo.png'} 
              alt='ife alumni logo' 
              height={200} 
              width={200} 
              className='max-md:w-[150px]'
            />
          </div>

          <div className='hidden md:flex gap-[2.5em]'>
            <Link href={"#"}>Home</Link>
            <Link href={"#"}>Community</Link>
            <Link href={"#"}>Gallery</Link>
            <Link href={"#"}>Contact us</Link>
          </div>

          <div className='block md:hidden'><Menu /></div>
        </header>
    </div>
  )
}
